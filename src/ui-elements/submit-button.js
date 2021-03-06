import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const SubmitButton = props => (
  <TouchableOpacity onPress={() => props.onPress()} style={[styles.container, {backgroundColor:props.bgColor}]}>
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
)

SubmitButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  hasBGColor: PropTypes.bool,
  bgColor: PropTypes.string
}

SubmitButton.defaultProps = {
  title: 'Submit',
  hasBGColor: false,
  bgColor: BLUE
}

let styleWithBG = function(color) {
  return {
    flex: 1,
    height: 64,
    borderRadius: 8,
    backgroundColor: color,
    justifyContent: 'center',
    overflow: 'hidden'
  }
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    height: 64,
    borderRadius: 8,
    backgroundColor: BLUE,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    fontFamily: 'roboto-bold'
  }
})

export default SubmitButton;
