import React from 'react'
import { View, Text, StyleSheet, TextInput} from 'react-native'
import {Controller} from 'react-hook-form';



const CustomInput = ({control, name, placeholder, secureTextEntry, rules = {}}) => {
  return (
      <Controller
              control = {control}
              name = {name}
              rules = {rules}
              render = {({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                <View style = {[styles.container, {borderColor: error ? 'red' : '#54535c'}]}>
                    <TextInput 
                    style = {styles.input}
                    placeholderTextColor="#8f8d8d" 
                    value  = {value} 
                    onChangeText = {onChange} 
                    onBlue = {onBlur} 
                    placeholder = {placeholder}
                    secureTextEntry = {secureTextEntry}
                  
              />
              </View>
                {error && (
                  <Text style = {{color: 'red', alignSelf: 'flex-start', marginLeft: 14}}>{error.message || 'Error'}
                  </Text>
                )}
              </>
            )}
          />
   
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3a3b3d',
        color: '#7a7b7d',
        width: '95%',
        borderColor: '#54535c',
        borderWidth: 2,
        borderRadius: 10,
        
        paddingHorizontal:10,
        marginVertical: 5,
    },
    input: {
        color: 'white',
    },
});

export default CustomInput