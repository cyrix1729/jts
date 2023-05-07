import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import IconButton from '../Components/IconButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreatePingScreen = (pingCoord) => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { userMarker } = route.params;
  const [rating, setRating] = useState(5);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [typeError, setTypeError] = useState('');
  const [descriptionError, setDescriptionError] = useState(''); 


  const iconData = [
    { iconName: 'bird', label: 'Wildlife' },
    { iconName: 'road', label: 'Road' },
    { iconName: 'walk', label: 'Pavement' },
    { iconName: 'trash-can', label: 'Litter' },
    { iconName: 'binoculars', label: 'View' },
    { iconName: 'account-group', label: 'Busy' },
    { iconName: 'dots-horizontal', label: 'Other' },
  ];

  const goBack = () => {
    navigation.replace('Home');
  };


  const createPing = async () => {
    if (!selectedIcon) {
      setTypeError('Please choose type');
    } else {
      setTypeError('');
    }

    if (!description.trim()) {
      setDescriptionError('Please write a description');
    } else {
      setDescriptionError('');
    }

    if (selectedIcon && description.trim()) {
      try {
      const response = await fetch('http://10.0.2.2:8000/api/pings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: userMarker.latitude,
          long: userMarker.longitude,
          ping_type: selectedIcon.toLowerCase(),
          desc: description,
          rating: rating,
        }),
      });
  
      if (response.ok) {
        navigation.navigate('Home')
      } else {
        
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
  
  const renderIconButtons = () => {
    return iconData.map((icon) => (
      <View key={icon.iconName} style={styles.iconButtonContainer}>
        <IconButton
          iconName={icon.iconName}
          active={selectedIcon === icon.label}
          onPress={() => setSelectedIcon(icon.label)}
          size={50}
          style={styles.iconButton}
        />
        <Text style={styles.iconLabel}>{icon.label}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.inputTitle}>Type</Text>
      <View style={styles.iconContainer}>{renderIconButtons()}</View>
      {typeError ? <Text style={styles.errorText}>{typeError}</Text> : null}
      <Text style={styles.inputTitle}>Describe your ping</Text>
      <TextInput
        style={[styles.textInput, { textAlignVertical: 'top' }]}
        onChangeText={(text) => setDescription(text)}
        value={description}
        maxLength={199}
        multiline
        numberOfLines={3}
      />
      {descriptionError ? (
        <Text style={styles.errorText}>{descriptionError}</Text>
      ) : null}

  <Text style={styles.inputTitle}>How do you feel your ping? </Text>
  <View style={styles.row}>
  <Icon
    name="emoticon-sad"
    size={30}
    color={rating === 0 ? '#5438f2' : '#fff'}
  />
  <Slider
    value={rating}
    onValueChange={(value) => setRating(value)}
    minimumValue={0}
    maximumValue={10}
    step={1}
    thumbStyle={styles.thumb}
    trackStyle={styles.track}
    style={{ width: '80%' }}
  />
  <Icon
    name="emoticon-happy"
    size={30}
    color={rating === 10 ? '#5438f2' : '#fff'}
  />
</View>
<Text style={styles.rating}>{rating}</Text>


      <View style={styles.createButtonContainer}>
      <TouchableOpacity style={styles.button} onPress={createPing}>
  <Text style={styles.buttonText}>Create</Text>
</TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1c',
  },
  inputTitle: {
    color: 'grey',
    fontSize: 20,
    marginBottom: 20,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  rating: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    textAlign: 'center',
    color: '#7a7b7d',
  },
  thumb: {
    backgroundColor: '#fff',
  },
  track: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textInput: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 60,
    backgroundColor: '#3a3b3d',
    color: '#7a7b7d',
    height: 90, // Set a fixed height for the TextInput
  },
  button: {
    backgroundColor: '#5438f2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButtonContainer: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 25,
  },
  iconButton: {
    marginBottom: 5,
  },
  iconLabel: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  createButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,},
    
    backButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
    errorText: {
      color: 'red',
      marginBottom: 20,
    },
});

export default CreatePingScreen;