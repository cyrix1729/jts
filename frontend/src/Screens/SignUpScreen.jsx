import { View, Text, Image, StyleSheet, Linking, ScrollView, Dimensions } from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../Components/customInput';
import CustomButton from '../Components/customButton';
import Oauth from '../Components/oauthSignIn';
import logo from '../../assets/images/jts-logo-only.png';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit, watch, formState: {errors}} = useForm();
    const password1 = watch('password')
    
    const onRegisterPress = async (data) => {
      try {
        const response = await fetch("http://10.0.2.2:8000/api/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            alias: data.username,
            password: data.password,
          }),
        });
    
        const responseData = await response.json();
        
        if (response.ok) {
          navigation.replace("Login");
          console.log("User successfully created:", responseData);
          // Store the access token and other received data as needed
        } else {
          console.warn("Error creating user:", responseData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const onPressTermsLink = () => {
        console.warn('onPressTermsLink')
    }
    const onPressPrivacyLink = () => {
        console.warn('onPressPrivacyLink')
    }
    const redirectLogin = () => {
        navigation.navigate('Login')
    }


return (

<ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator = {false}
        contentContainerStyle={styles.contentContainer}
      >
    
    
        <Image source = {logo} style = {styles.logo}/>
        <Text style = {styles.title}>Create an Account</Text> 
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
            name = 'username'
            placeholder = 'Username' 
            control = {control}
            rules = {{
                required: 'Username is required',
                pattern:{
                    value: /^[a-zA-Z0-9_]+$/i,
                    message: "Please use only letters (a-z), numbers (0-9), or underscores (_)"
              },
                minLength: {
                    value: 5,
                    message: 'Username must be longer than 5 characters'
              }
          }}
          />

    <CustomInput 
            name = 'password'
            placeholder = 'Password' 
            secureTextEntry
            control = {control}
            rules = {{
              required: 'Password is required',
              pattern:{
                value: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/i,
                message: "Please use at least one uppercase characters and one number"
              },
              minLength: {
                value: 5,
                message: 'Password must be longer than 5 characters'
              }
          }}
          />

    <CustomInput 
            name = 'password2'
            placeholder = 'Retype Password' 
            secureTextEntry
            control = {control}
            rules = {{
              required: 'Please retype your password',
              validate: 
                value => value == password1 || 'Passwords do not match',
          }}
          />

            <Text style = {styles.terms}>
                By creating an account, you confirm that you accept our {' '}
                <Text style =  {styles.link} onPress = {onPressTermsLink}>Terms of Service</Text> and {' '}
                <Text style =  {styles.link} onPress = {onPressPrivacyLink}>Privacy Policy</Text>
                
            </Text>

            <CustomButton 
            text = 'Create Account' 
                onPress = {handleSubmit(onRegisterPress)} 
                type = 'primary' 
                width = '95%'/>
            <View style = {{marginBottom: 0}}/>
            <Oauth/>

    <View style = {{marginTop: -12}}>
        <CustomButton 
            text = 'Already have an Account? Login in'
            onPress = {redirectLogin}
            fgColor = '#636362'
            type = 'tertiary'
            />
    </View> 

</ScrollView>
    
  )};

const HEIGHT = Dimensions.get("window").height;
const styles = StyleSheet.create({
    root: {
    alignItems: 'center',
    flex: 1,
    height: HEIGHT
    

    },
    title: {
        marginTop: 15,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    terms: {
        color: '#54535c',
        marginBottom: 10,
    },

    link : {
        color: '#ab5d11',
    },

    logo: {
        marginTop: 20,
        width: 125,
        height: 125,
    },
    scrollView: {
        width: '100%',
        backgroundColor: '#1c1c1c',

      },
      contentContainer: {
        paddingBottom: 50,
        alignItems: 'center',
      }
    });
    
export default SignUpScreen