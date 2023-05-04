import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const IconButton = ({ iconName, active, onPress, size = 30, style }) => {
  const iconColor = active ? '#5438f2' : '#fff';
  
  return (
    <TouchableOpacity onPress={onPress} style={[{ margin: 5 }, style]}>
      <Icon name={iconName} size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

export default IconButton;