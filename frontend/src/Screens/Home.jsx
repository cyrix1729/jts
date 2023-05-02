// Main Home Screen. Map interface shown here
// When the user moves more than 100m, the maps is rerendered, and new crime data is fetched (using the crimeData component)
// Note: the crime Api fetches crime data in a 1 mile radius the coordinates given

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CrimeData from '../Components/CrimeData';
import Pings from '../Components/Pings';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Components/customButton';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Main Home component
const Home = () => {
  // State to hold user location and crime data
  const [location, setLocation] = useState(null);
  const [crimeData, setCrimeData] = useState(null);
  // Ref for storing the watch position ID
  const watchId = useRef(null);
  const [pings, setPings] = useState([]);
  // State to control the side panel position
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const sidePanelPosition = useRef(new Animated.Value(-250)).current;
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const redirectProfile = () => {
    navigation.navigate('Profile')
  }

  const removeTokens = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      console.log('Tokens removed');
    } catch (error) {
      console.error('Error removing tokens', error);
    }
  };

  const Logout = async () => {
    await removeTokens();
    navigation.navigate('Login');
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
    Animated.timing(sidePanelPosition, {
      toValue: isSidePanelOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const openSidePanel = () => {
    Animated.timing(sidePanelPosition, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false
    }).start();
  };

  const closeSidePanel = () => {
    Animated.timing(sidePanelPosition, {
      toValue: -250,
      duration: 250,
      useNativeDriver: false
    }).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.dx > 5) {
        return true;
      } else if (gestureState.dx < -5) {
        return true;
      } else {
        return false;
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        sidePanelPosition.setValue(gestureState.dx);
      } else if (gestureState.dx < 0 && sidePanelPosition._value > -250) {
        sidePanelPosition.setValue(-250 + gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        openSidePanel();
      } else if (gestureState.dx < -100) {
        closeSidePanel();
      }
    }
  });



  // Callback function to update crime data state
  const handleCrimeDataReceived = (data) => {
    setCrimeData(data);
  };

  const handlePingsReceived = (pings) => {
    console.log('Pings received')
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
      console.log('granted', granted);
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

  // Get the initial user location when the component mounts
  useEffect(() => {
    const getLocation = async () => {
      const result = await requestLocationPermission();
      console.log('User location Received');
      if (result) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
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
      {/* Add a button to open the side panel */}

      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        showsTraffic={true}
        showsCompass={true}
        style={styles.map}
        mapType="terrain"
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0006,
          longitudeDelta: 0.0006,
        }}
      >
        {crimeData && crimeData.map((crime, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: parseFloat(crime.location.latitude),
              longitude: parseFloat(crime.location.longitude),
            }}
            title={crime.category}
            description={crime.month}
            
            pinColor={'yellow'}
          />
        ))}

{pings && pings.map((ping, i) => (
    <Marker
      key={`ping-${i}`}
      coordinate={{
        latitude: parseFloat(ping.lat),
        longitude: parseFloat(ping.long),
      }}
      title={ping.desc}
      description={ping.ping_type}
      pinColor="red"
    />
  ))}
        
        
      </MapView>
      <CrimeData location={location} onCrimeDataReceived={handleCrimeDataReceived} />
       <Pings onPingsReceived={handlePingsReceived} />
      <TouchableOpacity style={styles.sidePanelButton} onPress={toggleSidePanel}>
        <Text style={styles.sidePanelButtonText}>{isSidePanelOpen ? 'Close Panel' : 'Settings'}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.sidePanel, { left: sidePanelPosition }]}>
        <TouchableOpacity onPress={toggleSidePanel}>
          <Text style={{ color: 'purple', marginTop: 10 }}>Close Panel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSidePanel}>
          <Text style={{ color: 'black', marginTop: 10 }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSidePanel}>
          <Text style={{ color: 'black', marginTop: 10 }}>Information</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Logout}>
          <Text style={{ color: 'red', marginTop: 600}}>Logout</Text>
        </TouchableOpacity>
       
      </Animated.View>
    </View>
  );
};

// Define component styles
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 750,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  
  sidePanel: {
    position: 'absolute',
    backgroundColor: '#B49FEF',
    padding: 20,
    width: 250,
    height: '100%',
    zIndex: 1000
  },
  sidePanelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#B49FEF',
    borderRadius: 5,
    padding: 10,
    zIndex: 1000
  },
  sidePanelButtonText: {
    color: '#fff',
    fontSize: 16
  }
});


export default Home;