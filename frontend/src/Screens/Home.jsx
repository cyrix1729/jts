import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CrimeData from '../Components/CrimeData';

const Home = () => {
  const [location, setLocation] = useState(null);
  const [crimeData, setCrimeData] = useState(null);

  const handleCrimeDataReceived = (data) => {
    setCrimeData(data);
  };

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

  useEffect(() => {
    console.log('test');
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

  useEffect(() => {
    if (location) {
      console.log('Location updated');
    }
  }, [location]);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      </MapView>

      <CrimeData location={location} onCrimeDataReceived={handleCrimeDataReceived} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 500,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Home;