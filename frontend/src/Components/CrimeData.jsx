import React, { useState, useEffect, memo } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const getCrimeData = async (location, date) => {
  const lat = location.coords.latitude;
  const long = location.coords.longitude;
  try {
    const response = await axios.get(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${long}&date=${date}`);
    const crimeData = response.data;
    return crimeData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const CrimeData = memo(({ location, onCrimeDataReceived }) => {
  const [crimeData, setCrimeData] = useState(null);

  useEffect(() => {
    const date = '2023-03'; 
    // change this to current month
    const fetchCrimeData = async () => {
      const data = await getCrimeData(location, date);
      console.log('Crime Data received')
      setCrimeData(data);
    };
    fetchCrimeData();
  }, [location]);

  useEffect(() => {
    if (crimeData) {
      onCrimeDataReceived(crimeData);
    }
  }, [crimeData, onCrimeDataReceived]);

  return (
    <View>
    </View>
  );
});

export default CrimeData;

