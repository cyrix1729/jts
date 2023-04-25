import { View, Text, StyleSheet, Pressable} from 'react-native'
import React from 'react'

const customButton = ({ onPress, text, width, bgColor, fgColor, type = 'PRIMARY', alignment}) => {
  return (
    <Pressable onPress = {onPress} 
    style = {[
      styles.container, 
      styles[`container_${type}`],
      bgColor ? {backgroundColor: bgColor} : {},
      alignment ? {alignItems: alignment} : {},
      
      ]} 
      width = {width}>
      <Text style = {[
        styles.text,
        fgColor ? {color: fgColor} : {}
        ]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderColor: '#54535c',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal:10,
    marginVertical: 6,
    fontWeight: 'bold',
    
  },

  container_primary: {
    backgroundColor:'#8064fc'
  },
  container_secondary: {
    backgroundColor:'#431f8f'
  },

  container_tertiary: {
    borderColor: '#1c1c1c',
    color: '#7C46EA',
  },

  text: {
    color: 'white',
  }


});


export default customButton

