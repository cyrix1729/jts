import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const removeTokens = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      console.log('Tokens removed');
    } catch (error) {
      console.error('Error removing tokens', error);
    }
  };

  const Logout = async () => {
    await removeTokens();
    navigation.navigate('Login');
  };

  const getUserDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const response = await axios.get('http://10.0.2.2:8000/api/CustomUser/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          setUser(response.data[0]);
        }
      }
    } catch (error) {
      console.log('Couldnt fetch user info');
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.headerContainer}>
            <Icon name="account-circle" size={80} color="#fff" />
            <Text style={styles.title}>{user.alias}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="email" size={20} color="#fff" />
              <Text style={styles.detailText}>Email: {user.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar-clock" size={20} color="#fff" />
              <Text style={styles.detailText}>Date Joined: {formatDate(user.date_joined)}</Text>
            </View>
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={Logout}>
          <Text style={styles.buttonText}>Logout</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#fff',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
