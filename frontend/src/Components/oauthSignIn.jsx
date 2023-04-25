import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomButton from './customButton'


const onSignInPressed = () => {
    console.warn('Oauth Sign in')
}
const oauthSignIn = () => {
    return (
        <>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '85%'}}>
                <View style={{flex: 1, height: 1, backgroundColor: '#636362'}} />
                    <View>
                        <Text style={{width: 50, textAlign: 'center', color: '#636362'}}>OR</Text>
                    </View>
                <View style={{flex: 1, height: 1, backgroundColor: '#636362'}} />
            </View>
            
                <CustomButton text = 'Sign In with Google' onPress = {onSignInPressed}  width = '85%' fgColor = '#DD4D44' bgColor = '#f5a9a4'/>
                <CustomButton text = 'Sign in with Facebook' onPress = {onSignInPressed}  width = '85%'  fgColor = '#4765A9' bgColor = '#68a6ed'/>
            
            
        </>
)};
  
const styles = StyleSheet.create({
    buttons: {
        // flexDirection: 'row',
    },
  })
export default oauthSignIn