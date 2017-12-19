import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import * as Colors from '../constants/colors';

const OptionView = props => (
  <View style={styles.container} >
    {props.options.map(
      (option) =>
      <TouchableOpacity onPress={() => props.selectOption(option.index)} style={(option.selected) ? styles.buttonOn : styles.buttonOff} key={option.value} >
        <Text style={(option.selected) ? styles.textOn : styles.textOff} >
          {option.value}
        </Text>
      </TouchableOpacity>
    )}
  </View>
)

OptionView.propTypes = {
  options: PropTypes.array,
  selectOption: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  buttonOn: {
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 18,
    marginLeft: 24, marginRight: 24,
    color: 'white',
    textAlign: 'center'
  },
  textOff: {
    fontSize: 18,
    marginLeft: 24, marginRight: 24,
    color: Colors.DARK_GREY,
    textAlign: 'center'
  }
});

var mapStateToProps = state => {
  return {
    fontLoaded: state.setup.fontLoaded
  }
}

export default OptionView;
