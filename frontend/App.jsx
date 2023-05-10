import React, {useEffect} from 'react';
import { View, Text, Image, StyleSheet, Dimensions, StatusBar} from 'react-native';
import Navigation from './src/Navigation'
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from './src/Screens/LoadingScreen';
import {MenuProvider} from 'react-native-popup-menu';
const App = () => {
  const HEIGHT = Dimensions.get("window").height;
  return(
    <MenuProvider>
   <SafeAreaView style = {{
    backgroundColor: '#1c1c1c',
    flex: 1,
    height: HEIGHT
   }}>
{/* Match status bar color with background */}


<StatusBar backgroundColor="#1c1c1c" />
      <Navigation/>
   </SafeAreaView>
   </MenuProvider>
  );
};

export default App;