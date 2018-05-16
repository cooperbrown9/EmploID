import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Image, } from 'react-native';
import { BLUE, ORANGE, YELLOW, LIGHT_BLUE } from '../constants/colors';

const RoundButton = (props) => (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, {backgroundColor:props.color}]}>
      <Image style={{ tintColor: 'white', width: 32, height: 32}} source={props.imagePath}/>
    </TouchableOpacity>
);

RoundButton.propTypes = {
  imagePath: PropTypes.number,
  onPress: PropTypes.func,
  color: PropTypes.string
}

RoundButton.defaultProps = {
  imagePath: require('../../assets/icons/back.png'),
  color: BLUE
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: LIGHT_BLUE,    //'#155ade',
  //  shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
