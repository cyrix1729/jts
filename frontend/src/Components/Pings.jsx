import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const Pings = ({ onPingsReceived }) => {
  const getPings = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/api/pings/`);
      const Pings = response.data;
      if (onPingsReceived) {
        onPingsReceived(Pings);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPings();
  }, []); // Empty dependency array ensures the effect runs only once, when the component mounts

  
};

export default Pings;