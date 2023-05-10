import React, { useState, useEffect, useRef, memo  } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import {MenuProvider, Menu,MenuOptions,MenuOption,MenuTrigger} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

const RouteSettings = ({ onMenuOptionSelect }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const handleMenuOptionSelect = (option) => {
    onMenuOptionSelect(option); // Call the callback function with the selected option
    setIsMenuVisible(false);
  };

  return (
    <Menu opened={isMenuVisible} onBackdropPress={() => setIsMenuVisible(false)}>
      <MenuTrigger>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsMenuVisible(!isMenuVisible)}
        >
          <Icon name="bars" size={24} color="white" />
        </TouchableOpacity>
      </MenuTrigger>
      <MenuOptions>
        <View style={styles.menuTitleContainer}>
          <Text style={styles.menuTitle}>Journey path filter</Text>
        </View>
        <MenuOption onSelect={() => handleMenuOptionSelect('none')}>
          <Text style={styles.menuOptionText}>None</Text>
        </MenuOption>
        <MenuOption onSelect={() => handleMenuOptionSelect('least crime reports')}>
          <Text style={styles.menuOptionText}>Least Crime Reports</Text>
        </MenuOption>
        <MenuOption onSelect={() => handleMenuOptionSelect('most positive pings')}>
          <Text style={styles.menuOptionText}>Most Positive Pings</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  )
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
  },
  menuTitleContainer: {
    padding: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  menuOptionText: {
    fontSize: 18,
    padding: 10,
    color: 'blue',
  },
});

export default RouteSettings;