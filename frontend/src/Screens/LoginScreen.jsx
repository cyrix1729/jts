import React, {useState, useEffect} from 'react';
import { View, 
  Text, 
  Image, 
  StyleSheet, 
  useWindowDimensions, 
  Linking, 
  ScrollView, 
  Dimensions,
  TextInput,
  TouchableOpacity, 
  Animated } 
from 'react-native';
import CustomInput from '../Components/customInput';
import CustomButton from '../Components/customButton';
import Logo from '../../assets/images/jts-logo-nobg-crop.png';
import Oauth from '../Components/oauthSignIn';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

  
const LoginScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const storeTokens = async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Error storing tokens', error);
    }
  };

  const LoginPressed = async (data) => {
    try {
      const response = await axios.post(`http://10.0.2.2:8000/api/token/`, {
        email: data.email,
        password: data.password,
      });

      if (response.data && response.data.access && response.data.refresh) {
        await storeTokens(response.data.access, response.data.refresh);
        navigation.navigate('Home');
      } else {
        setErrorMessage('Incorrent Credentials Entered');
      }
    } catch (error) {
      setErrorMessage('Incorrent Credentials Entered');
      console.error('Error logging in', error);
    }
  };

    const redirectRegister = () => {
      navigation.navigate('SignUp')
    }

    const redirectFP = () => {
      navigation.navigate('ForgotPassword')
    }

    return (
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator = {false}
        contentContainerStyle={styles.contentContainer}
      >

          <Image source = {Logo} style = {styles.logo}/>
          <Text style = {styles.logIn}>Login</Text> 

          {/* <Text style = {styles.welcome}>Welcome Back!</Text> */}

          {/* Input fields  */}
          <CustomInput 
            name = 'email'
            placeholder = 'Email' 
            control = {control}
            rules = {{
              required: 'Email is required',
              pattern:{
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid Email Address"
              }
          
          
          }}
          />
          <CustomInput 
            name = 'password'
            placeholder = 'Password' 
            secureTextEntry
            control = {control}
            rules = {{required: 'Password is required',
          }}
            />

          {/* Submit button */}
          <CustomButton text = 'Login' onPress = {handleSubmit(LoginPressed)} type = 'primary' width = '95%'/>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          {/* Forgot password button */}
          <View style = {{marginLeft: 'auto', marginRight: 10, marginTop: -30}}>
            <CustomButton 
            text  = 'Forgot Password?' 
            onPress = {redirectFP} 
            type = 'tertiary' 
            width = '40%' 
            alignment = 'flex-end' />
        </View>
          
          {/* Adds space after forgot password button */}
          <View style = {styles.space}/> 
          
        <Oauth/>

          {/* Redirect to make an account button */}
          <CustomButton text = 'New? Make an account' onPress = {redirectRegister}   width = '55%'  type = 'tertiary'/>
            
      </ScrollView>
    );
  };

const HEIGHT = Dimensions.get("window").height;
const styles = StyleSheet.create({
  logo:{
    width: '70%',
    maxWidth: 300,
    height: 120,
    marginTop:40,
    marginBottom:50,
  },
  logIn: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 'auto',
    fontSize: 30,
    color: '#54535c',
    marginBottom: 5,
    marginLeft: 12,
    fontFamily: 'sans-serif-light',
  },

  welcome: {
    fontSize: 30,
    color: '#54535c',
    marginBottom: 40,
    fontFamily: 'sans-serif-light',
    marginRight:160,
    
  },

  space: {  
    marginBottom:10,
  },

  line:{
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    width: '100%',
    backgroundColor: '#1c1c1c',

  },
  contentContainer: {
    width: '100%',
    paddingBottom: 50,
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },



})

export default LoginScreen