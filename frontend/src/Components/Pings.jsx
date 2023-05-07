import React, { useState, useEffect, memo } from 'react';
import { View, Text } from 'react-native';

const Pings = memo(({ onPingsReceived }) => {
  const getPings = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/pings/');
      const Pings = await response.json();
      if (onPingsReceived) {
        onPingsReceived(Pings);
        console.log(Pings)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPings();
  }, []); // Empty dependency array ensures the effect runs only once, when the component mounts
});

export default Pings;