import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/jts-logo-nobg-crop.png';
import * as Animatable from 'react-native-animatable';

const LoadingScreen = () => {
  const navigation = useNavigation();

  const autoLogin = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const response = await fetch('http://10.0.2.2:8000/api/CustomUser/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      autoLogin();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const CustomAnimation = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 1,
      scale: 1.2,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <View style={styles.contentContainer}>
      <Animatable.Image
        animation={CustomAnimation}
        duration={2500}
        iterationCount={1}
        source={Logo}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '70%',
    maxWidth: 300,
    alignSelf: 'center',
    height: 120,
    marginBottom: 70,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
});

export default LoadingScreen;
