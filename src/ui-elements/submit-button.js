import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const SubmitButton = props => (
  <TouchableOpacity style={styles.container} >
    <Text style={styles.text}>Submit</Text>
  </TouchableOpacity>
)

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: BLUE,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white'
  }
})

export default SubmitButton;
