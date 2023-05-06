import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const deviceWidth = Dimensions.get('window').width;

const BottomPanel = memo(({ onPingPress }) => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    console.log('Profile button pressed');
    navigation.navigate('Profile');
  };

  const handleCreateJourneyPress = () => {
    console.log('Create journey button pressed');
    // Add functionality
  };

  const handleCreatePingPress = () => {
    console.log('Create ping button pressed');
    onPingPress(); // Call the passed function from the parent component
  };

  return (
    <View style={[styles.container, { backgroundColor: '#5438f2', width: deviceWidth + 20 }]}>
      <IconButton
        icon={() => <MaterialCommunityIcons name="account" size={24} color="white" />}
        onPress={handleProfilePress}
      />
      <IconButton
        icon={() => <MaterialCommunityIcons name="run" size={24} color="white" />}
        onPress={handleCreateJourneyPress}
      />
      <IconButton
        icon={() => <MaterialCommunityIcons name="map-marker-plus" size={24} color="white" />}
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
    paddingBottom: 12,
    paddingTop: 10,
    borderRadius: 0,
    marginLeft: -20,
    marginRight: -20,
  },
});

export default BottomPanel;