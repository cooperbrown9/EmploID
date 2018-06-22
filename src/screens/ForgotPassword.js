import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, TextInput, StyleSheet } from 'react-native';
import { textInputFactory } from '../util';

// tie loginscreen's state.email to this one, then delete it on unmount
const ForgotPassword = props => (
  <View style={styles.container} >
    <View style={styles.headerView}>
      <Text style={styles.loginText}>Login</Text>
    </View>

    <View style={styles.inputContainer} >
      <View style={styles.inputView} >
        {textInputFactory('Email', (text) => {props.setEmail(text)}, props.email)}
      </View>
    </View>

  </View>
)

ForgotPassword.propTypes = {
  email: PropTypes.func,
  setEmail: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerView: {
    marginTop: 32, marginLeft: 32, marginRight: 32
  },
  loginText: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'roboto-bold',
    color: 'white'
  },
  inputContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 64
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
});

export default ForgotPassword;
