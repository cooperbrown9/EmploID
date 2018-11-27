import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const SubmitButtonCounter = props => (
  <TouchableOpacity onPress={() => props.onPress()} style={(props.hasBGColor) ? styleWithBG(props.bgColor) : styles.container} >
    <Text style={styles.text}>{props.title}</Text>
    <Text style={{height:32,width:32,fontSize:12,fontFamily:'roboto-bold',color:'white',textAlign:'center'}}>8</Text>
  </TouchableOpacity>
)

SubmitButtonCounter.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  hasBGColor: PropTypes.bool,
  bgColor: PropTypes.string
}

SubmitButtonCounter.defaultPropTypes = {
  title: 'Submit',
  hasBGColor: false,
  bgColor: BLUE
}

let styleWithBG = function(color) {
  return {
    flex: 1, flexDirection: 'row',
    justifyContent: 'space-between',
    height: 64,
    borderRadius: 8,
    backgroundColor: color,
    overflow: 'hidden'
  }
}

const styles =  StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'row',
    height: 64,
    borderRadius: 8,
    backgroundColor: BLUE,
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    fontFamily: 'roboto-bold'
  }
})

export default SubmitButtonCounter;
