import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, StatusBar} from 'react-native';
import Navigation from './src/Navigation'
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from './src/Screens/Home';


const App = () => {
  const HEIGHT = Dimensions.get("window").height;
  return(
   <SafeAreaView style = {{
    backgroundColor: '#1c1c1c',
    flex: 1,
    height: HEIGHT
   }}>
{/* Match status bar color with background */}
<StatusBar backgroundColor="#1c1c1c" />
   <Home/>
      {/* <Navigation/> */}
   </SafeAreaView>
  );
};

export default App;