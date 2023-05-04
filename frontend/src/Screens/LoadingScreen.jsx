import { View, Text, StyleSheet, Image} from 'react-native'
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/jts-logo-nobg-crop.png';

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
          navigation.navigate('Home');
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      navigation.navigate('Login');
    }
  };
  
  useEffect(() => {
    autoLogin();
  }, []);



  return (
    <View style = {styles.contentContainer}>
      <Image source = {Logo} style = {styles.logo}/>
    </View>
  )
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
})



export default LoadingScreen