import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Image, } from 'react-native';

const RoundButton = (props) => (
<<<<<<< HEAD
    <TouchableOpacity style={styles.button}>
      <Image style={{ tintColor: 'white', width: 24, height: 24}} source={props.imagePath}/>
=======
    <TouchableOpacity onPress={() => props.onPress()} style={styles.button}>
      <Image style={{ tintColor: 'white', width: 32, height: 32}} source={props.imagePath}/>
>>>>>>> 755b51828c5655a5d8977a7623b660e59d5b58cd
    </TouchableOpacity>
);

RoundButton.propTypes = {
  imagePath: PropTypes.string,
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
    backgroundColor: '#155ade',
  //  shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
