// Main Home Screen. Map interface shown here
// When the user moves more than 100m, the maps is rerendered, and new crime data is fetched (using the crimeData component)
// Note: the crime Api fetches crime data in a 1 mile radius the coordinates given

import React, { useState, useEffect, useRef, memo  } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Animated,
  PanResponder,
  Dimensions,
  Image 
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import  { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Components 
import CustomButton from '../Components/customButton';
import BottomPanel from '../Components/BottomPanel';
import CrimeData from '../Components/CrimeData';
import Pings from '../Components/Pings';
import CrimeMarker from '../Components/CrimeMarker';
import PingOverlay from '../Components/PingOverlay';

//animations
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';


// Main Home component
const Home = () => {
  // State to hold user location and crime data
  const [location, setLocation] = useState(null);
  const [crimeData, setCrimeData] = useState(null);
  // Ref for storing the watch position ID
  const watchId = useRef(null);
  const [pings, setPings] = useState([]);
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
    // Used to share cooridnates with CreatePingScreen
  const [userMarker, setUserMarker] = useState(null);
  const [createMarkerEnabled, setCreateMarkerEnabled] = useState(false);
  // Use Dark mode in maps if it is night time
  const [isNightTime, setisNightTime] = useState(false);
  // 'Hold down to create ping' useState
  const [message, setMessage] = useState('');
  //overlay that shows ping details
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedPing, setSelectedPing] = useState(null);
  const [expandedOverlay, setExpandedOverlay] = useState(false);

  //For animation of create ping!
  const ToastMessageAnimation = {
    0: {
      opacity: 1,
      translateY: 30,
    },
    0.5: {
      opacity: 1,
      translateY: 0,
    },
    1: {
      opacity: 0,
      translateY: -30,
    },
  };
    //displays alert message when user tries to create a new ping
  const getAlertStyle = (message) => ({
  fontSize: 25,
  marginBottom: 520,
  color: 'backButton',
  opacity: 0.9,
  paddingLeft: 0,
  paddingRight: 7,
  textAlign: 'center',
  marginLeft: 10,
  fontWeight: 'bold',
});

const handleMarkerPress = (ping) => {
  if (overlayVisible && selectedPing && selectedPing.id === ping.id) {
    setOverlayVisible(false);
    setSelectedPing(null);
  } else {
    setSelectedPing(ping);
    setOverlayVisible(true);
  }
};
  
  const onPingPress = () => {
    if (message === '') {
      setMessage('Hold Down to Create a New Ping');
    } else {
      setMessage('');
    }
  };

  const toggleCreateMarker = () => {
    setCreateMarkerEnabled(!createMarkerEnabled);
    setUserMarker(null);
    setMessage('');
  };

  const handleMapLongPress = (e) => {
    if (message !== ''){
      setUserMarker(e.nativeEvent.coordinate);
      setMessage('');
      navigation.replace('CreatePing', { userMarker: e.nativeEvent.coordinate });
      setUserMarker(null);
    } 
  };

  // Callback function to update crime data state
  const handleCrimeDataReceived = (data) => {
    setCrimeData(data);
  };

  const handlePingsReceived = (pings) => {
    console.log('Pings received from database')
    setPings(pings.pings || []);
  };

    

  // Function to calculate the distance between two points in meters
  const calculateDistance = (prevPosition, newPosition) => {
    // Helper function to convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    // Extract latitude and longitude from previous and new positions
    const lat1 = prevPosition.coords.latitude;
    const lon1 = prevPosition.coords.longitude;
    const lat2 = newPosition.coords.latitude;
    const lon2 = newPosition.coords.longitude;

    // Calculate the distance using the haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Function to watch user's position and update location when the user moves more than 100 meters
  const watchPosition = () => {
    watchId.current = Geolocation.watchPosition(
      (position) => {
        const distance = calculateDistance(location, position);
        if (distance >= 100) {
          setLocation(position);
        }
      },
      (error) => console.log(error.code, error.message),
      { enableHighAccuracy: true, distanceFilter: 100, interval: 10000, fastestInterval: 5000 },
    );
  };

  const showToastMessage = (message) => {
    if (message !== "") {
      return (
        <Animatable.Text
          animation={ToastMessageAnimation}
          duration={6000}
          iterationCount='infinite'
          onAnimationEnd={() => setMessage("")}
          style={getAlertStyle(message)}
        >
          {message}
        </Animatable.Text>
      );
    } else {
      return null;
    }
  };

  // Function to request location permission from the user
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Geolocation Permission granted');
        return true;
      } else {
        console.log('Geolocation Permission Denied');
        return false;
      }
    } catch (err) {
      return false;
    }
  };


  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime >= 19 || currentTime <= 4){
      setisNightTime(true);
    }
    console.log(currentTime, 'Night time: ', isNightTime)
  }, []);

  
  // Get the initial user location when the component mounts
  useEffect(() => {
    const getLocation = async () => {
      const result = await requestLocationPermission();
      console.log('User location Received');
      if (result) {
        Geolocation.getCurrentPosition(
          position => {

            setLocation(position);
          },
          error => {
            console.log(error.code, error.message);
            setLocation(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    };

    getLocation();
  }, []);

  // Watch user's position and update the location state when they move more than 100 meters
  useEffect(() => {
    if (location) {
      console.log('Location updated');
      watchPosition();
    }
    // Clean up the watch position listener when the component is unmounted or location updates
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [location]);

  // Show a loading message if the location is not yet available
  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render the MapView with user location, crime markers, and crime data component
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        animationEnabled = {false}

        showsUserLocation={true}
        followsUserLocation={true}
        showsTraffic={true}
        showsCompass={true}
        style={styles.map}
        customMapStyle={isNightTime ? mapStyleDark : mapStyle}
        onLongPress={handleMapLongPress}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0006,
          longitudeDelta: 0.0006,
        }}
      >
        {crimeData && crimeData.map((crime, i) => (
  <CrimeMarker
    key={i}
    coordinate={{
      latitude: parseFloat(crime.location.latitude),
      longitude: parseFloat(crime.location.longitude),
    }}
    title={crime.category}
    description={crime.month}
  />
))}

{pings && pings.map((ping, i) => (
  <Marker
    key={`ping-${i}`}
    coordinate={{
      latitude: parseFloat(ping.lat),
      longitude: parseFloat(ping.long),
    }}
    pinColor={ping.rating >= 5 ? 'green' : 'red'}
    onPress={() => handleMarkerPress(ping)}
  />
))}
      </MapView>
      


      <PingOverlay
  overlayVisible={overlayVisible}
  selectedPing={selectedPing}
  expandedOverlay={expandedOverlay}
  setExpandedOverlay={setExpandedOverlay}
  onClose={() => setOverlayVisible(false)}
/>
{showToastMessage(message)}
      <CrimeData location={location} onCrimeDataReceived={handleCrimeDataReceived} />
       <Pings onPingsReceived={handlePingsReceived} />
       <BottomPanel onPingPress={onPingPress} />
    </View>
  );
};

// Define component styles
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 750,
    width: 400,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
  });
  


// Map styles
const mapStyle = [
  {
    "featureType": "administrative.country",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape.natural.landcover",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.government",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#55AC47"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.icon",
    "stylers": [
      {
        "color": "#9900ff"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#89F11E"
      },
      {
        "weight": 1
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#00b3ff"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 1
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  }
]

const mapStyleDark =
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]















export default Home;