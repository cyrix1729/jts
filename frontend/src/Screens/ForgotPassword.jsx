import { View, Text, Image, StyleSheet, Linking, ScrollView, Dimensions} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../Components/customInput';
import CustomButton from '../Components/customButton';
import Oauth from '../Components/oauthSignIn';
import logo from '../../assets/images/jts-logo-only.png';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';

const ForgotPassword = () => {
    const {control, handleSubmit, watch, formState: {errors}} = useForm();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const SendLink = () => {
        console.warn('Link Sent')
    }
    const redirectLogin = () => {
        navigation.navigate('Login')
    }

return (
<ScrollView showsVerticalScrollIndicator = {false}>

        <View style = {styles.root}>
            <Image source = {logo} style = {styles.logo}/>
            <Text style = {styles.title}>Forgot Password</Text> 
            <Text style = {styles.instructions}>
                A link to reset your password will be sent to your email
                    
                </Text>
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

                <CustomButton 
                text = 'Send Link' 
                    onPress = {handleSubmit(SendLink)} 
                    type = 'primary' 
                    width = '95%'/>
        <View style = {{marginBottom: 10}}/>
        

    <CustomButton 
        text = "Didn't receive code?"
        fgColor = '#636362'
        type = 'tertiary'
        />

    <CustomButton 
        text = "Go back to Login"
        fgColor = '#ab5d11'
        type = 'tertiary'
        onPress = {redirectLogin}
        />
        
    </View>
</ScrollView>
    
  )};
const HEIGHT = Dimensions.get("window").height;
const styles = StyleSheet.create({
    root: {
    // backgroundColor: '#1c1c1c',
    alignItems: 'center',
    size: 50,
    backgroundColor: '#1c1c1c',
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
    instructions: {
        color: '#54535c',
        padding: 3,
    },

    link : {
        color: '#ab5d11',
    },

    logo: {
        marginTop: 20,
        width: 125,
        height: 125,
    }
})
export default ForgotPassword