import React, { Component } from 'react';
import * as Colors from '../constants/colors';
import PropTypes from 'prop-types';

import { View, Text, TextInput, StyleSheet } from 'react-native';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

function textInputFactory(placeholder, onTextChange, value, canEdit = true, keyboard = 'default') {
  return (
    <TextInput
      placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
      selectionColor={Colors.BLUE} style={styles.input}
      autoCorrect={false} autoCapitalize={false}
      onChangeText={(text) => onTextChange(text)}
      value={value}
      editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
    />
  )
}

// tie loginscreen's state.email to this one, then delete it on unmount
const ForgotPassword = props => (
  <View style={styles.container} >

    <View style={styles.backButton}>
      <RoundButton imagePath={require('../../assets/icons/down.png')} onPress={props.dismiss}/>
    </View>


    <View style={styles.headerView}>
      <Text style={styles.loginText}>Forgot Password</Text>
    </View>

    <View style={styles.inputContainer} >
      <View style={styles.inputView} >
        {textInputFactory('Email', (text) => {props.setEmail(text)}, props.email)}
      </View>

    </View>

    <View style={{height: 64, position:'absolute',left:32,right:32,bottom:100}} >
      <SubmitButton bgColor={'black'} onPress={props.resetPassword} title={'RESET'} />
    </View>

  </View>
)

ForgotPassword.propTypes = {
  email: PropTypes.func,
  setEmail: PropTypes.func,
  resetPassword: PropTypes.func,
  dismiss: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.BACKGROUND_GREY,
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute', left: 20, top: 40,
    zIndex: 1001
  },
  headerView: {
    position: 'absolute', left: 0, right: 0, top: 150, height: 64
  },
  loginText: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'roboto-bold',
    color: 'black'
  },
  inputContainer: {
    marginLeft: 16, marginRight: 16, justifyContent: 'center'
  },
  input: {
    marginLeft: 16,
    fontSize: 18,
    color: 'black',
    fontFamily: 'roboto-regular'
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 16, marginRight: 8, marginLeft: 8,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginLeft: 32, marginRight: 32, marginTop: 16,
    backgroundColor: 'green', zIndex: 10000
  },
});

export default ForgotPassword;
