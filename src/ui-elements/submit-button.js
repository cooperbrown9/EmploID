import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const SubmitButton = props => (
  <TouchableOpacity onPress={() => props.onPress()} style={styles.container} >
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
)

SubmitButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func
}

SubmitButton.defaultPropTypes = {
  title: 'Submit'
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: BLUE,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontFamily: 'roboto-bold'
  }
})

export default SubmitButton;
