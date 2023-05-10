import React, { memo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const deviceWidth = Dimensions.get('window').width;

const BottomPanel = memo(({ onPingPress, onJourneyPress }) => {
  const navigation = useNavigation();

  // Declare state variables for icon colors
  const [profileColor, setProfileColor] = useState('white');
  const [journeyColor, setJourneyColor] = useState('white');
  const [pingColor, setPingColor] = useState('white');

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleCreateJourneyPress = () => {
    if (journeyColor === 'white') {
      setJourneyColor('#7a63ff');
      setPingColor('white');
    } else {
      setJourneyColor('white');
    }
    onJourneyPress(); // Call the passed function from the parent component
  };

  const handleCreatePingPress = () => {
    if (pingColor === 'white') {
      setPingColor('#7a63ff');
      setJourneyColor('white');
    } else {
      setPingColor('white');
    }
    onPingPress(); // Call the passed function from the parent component
  };

  return (
    <View style={[styles.container, { backgroundColor: '#1c1c1c', width: deviceWidth + 20 }]}>
      <IconButton
        icon={() => <MaterialCommunityIcons name="account" size={24} color={profileColor} />}
        onPress={handleProfilePress}
      />
      <IconButton
        icon={() => <MaterialCommunityIcons name="run" size={24} color={journeyColor} />}
        onPress={handleCreateJourneyPress}
      />
      <IconButton
        icon={() => <MaterialCommunityIcons name="map-marker-plus" size={24} color={pingColor} />}
        onPress={handleCreatePingPress}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 3,
    borderRadius: 0,
    marginLeft: -20,
    marginRight: -20,
    
  },
});

export default BottomPanel;
