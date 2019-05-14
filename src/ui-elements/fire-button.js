import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BLUE, ORANGE, YELLOW, LIGHT_BLUE, BACKGROUND_GREY, MID_GREY } from '../constants/colors';

const FireButton = (props) => (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, { backgroundColor: (props.isOn) ? BLUE : MID_GREY }]}
    >
      <Text style={{ width: 32, height: 32, textAlign:'center', fontSize: 24, alignSelf: 'center'}}>🔥</Text>
    </TouchableOpacity>
);

FireButton.propTypes = {
  onPress: PropTypes.func,
  isOn: PropTypes.bool,
  color: PropTypes.string
}

FireButton.defaultProps = {
  color: MID_GREY,
  isOn: false
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: MID_GREY,    //'#155ade',
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FireButton;
