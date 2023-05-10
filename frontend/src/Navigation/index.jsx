import React, {useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import Screens
import ForgotPassword from '../Screens/ForgotPassword';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import HomeScreen from '../Screens/Home';
import LoadingScreen from '../Screens/LoadingScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import CreatePingScreen from '../Screens/CreatePingScreen';
import CreateJourneyScreen from '../Screens/CreateJourneyScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer style>
      <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name = 'Loading' component={LoadingScreen}/>
      <Stack.Screen name = 'Login' component={LoginScreen}/>
        <Stack.Screen name = 'SignUp' component={SignUpScreen}/>
        <Stack.Screen name = 'ForgotPassword' component={ForgotPassword}/>
        <Stack.Screen name = 'Home' component={HomeScreen}/>
        <Stack.Screen name = 'Profile' component={ProfileScreen}/> 
        <Stack.Screen name = 'CreatePing'component={CreatePingScreen}/>
        <Stack.Screen name = 'CreateJourney'component={CreateJourneyScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    color: 'white',
  },
});


export default Navigation;