import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, Linking, ScrollView, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Animated} from 'react-native-maps';
import UserLocation from './UserLocation';

const Map = (location) => {

  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')

  setLat(location.location.coords)
  console.log(lat)
return (
  <View style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       mapType = "terrain"
       initialRegion={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}>
        </MapView>
    </View>
    
  )};
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 500,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#1c1c1c',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });
export default Map

