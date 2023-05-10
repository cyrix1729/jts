import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateJourney = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const goBack = () => {
    navigation.goBack();
  };

 
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
      
      
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
 mainContainer: {
  flex: 1,
  backgroundColor: '#1c1c1c',
},
container: {
  flex: 1,
  padding: 20,
},
topBar: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: 10,
},
backButton: {
  paddingHorizontal: 10,
  paddingVertical: 5,
},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  

});

export default CreateJourney;
