import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const SubmitButton = props => (
  <TouchableOpacity onPress={() => props.onPress()} style={(props.hasBGColor) ? styleWithBG(props.bgColor) : styles.container}>
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
)

SubmitButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  hasBGColor: PropTypes.bool,
  bgColor: PropTypes.string
}

SubmitButton.defaultPropTypes = {
  title: 'Submit',
  hasBGColor: false,
  bgColor: BLUE
}

let styleWithBG = function(color) {
  return {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: color,
    justifyContent: 'center'
  }
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: BLUE,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    fontFamily: 'roboto-bold'
  }
})

export default SubmitButton;
