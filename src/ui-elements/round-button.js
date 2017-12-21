import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Image, } from 'react-native';

const RoundButton = (props) => (
    <TouchableOpacity style={styles.button}>
      <Image style={{ tintColor: 'white', width: 25, height: 25}} source={props.imagePath}/>
    </TouchableOpacity>
);

RoundButton.propTypes = {
  imagePath: PropTypes.string,
}

RoundButton.defaultPropTypes = {
  imagePath: require('../../assets/icons/back.png'),
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#155ade',
  //  shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundButton;
