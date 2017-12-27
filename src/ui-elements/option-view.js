import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

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

OptionView.selected = function(arr, index, callback) {
  if(arr[index].selected) {
    arr[index].selected = false;
  } else {
    for(let i = 0; i < arr.length; i++) {
      arr[i].selected = false;
    }
    arr[index].selected = true;
  }
  callback(arr);
}

OptionView.selectedExclusive = function(arr, index, callback) {
  for(let i = 0; i < arr.length; i++) {
    arr[i].selected = false;
  }
  arr[index].selected = true;
  callback(arr);
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',

  },
  buttonOn: {
    flexGrow: 1,
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: 'black',
    justifyContent: 'center',
    width: FRAME.width * (1/4) - 8
  },
  buttonOff: {
    flexGrow: 1,
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center',
    width: FRAME.width * (1/4) - 8
  },
  textOn: {
    fontSize: 18,
    marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-regular'
  },
  textOff: {
    fontSize: 18,
    marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-regular'
  }
});

var mapStateToProps = state => {
  return {
    fontLoaded: state.setup.fontLoaded
  }
}

export default OptionView;
