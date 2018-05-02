import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Image, } from 'react-native';
import { BLUE, ORANGE, YELLOW } from '../constants/colors';

const RoundButton = (props) => (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Image style={{ tintColor: 'white', width: 32, height: 32}} source={props.imagePath}/>
    </TouchableOpacity>
);

RoundButton.propTypes = {
  imagePath: PropTypes.number,
  onPress: PropTypes.func
}

RoundButton.defaultPropTypes = {
  imagePath: require('../../assets/icons/back.png'),
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: BLUE,    //'#155ade',
  //  shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
