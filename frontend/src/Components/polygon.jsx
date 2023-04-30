import { View, Text } from 'react-native'
import React from 'react'

const polygon = (location) => {
  console.log('FROM CRIMEDATA')
  const latitude = location.location.coords.latitude
  const longitude = location.location.coords.longitude 
  const earthRadius = 6378137; // in meters
  const radius = 1000; // in meters
  const latDelta = (radius * 360) / (2 * Math.PI * earthRadius);
  const lonDelta = Math.abs(Math.atan2(Math.sin(0.5 * Math.PI) * Math.sin(radius / earthRadius), Math.cos(0.5 * Math.PI) - Math.sin(latitude) * Math.sin(latitude)) * 2 * 180 / Math.PI);
  const squareCoords = [
    {
      latitude: latitude - latDelta,
      longitude: longitude - lonDelta,
    },
    {
      latitude: latitude - latDelta,
      longitude: longitude + lonDelta,
    },
    {
      latitude: latitude + latDelta,
      longitude: longitude + lonDelta,
    },
    {
      latitude: latitude + latDelta,
      longitude: longitude - lonDelta,
    },
  ];

console.log(squareCoords)
  
  // console.log(squareCoords)
  return (
    <View>
      <Text>getCrimeData</Text>
    </View>
  )
}

export default polygon