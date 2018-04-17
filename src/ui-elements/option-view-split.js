import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import * as Colors from '../constants/colors';

const OptionViewSplit = props => (
  <View style={styles.container} >
    {props.options.map(
      (option) =>
      <TouchableOpacity
        onPress={() => props.selectOption(option.index)}
        style={ ((option.selected) ? styles.buttonOn : styles.buttonOff) }
        key={option.value} >
        <Text style={(option.selected) ? styles.textOn : styles.textOff} >
          {option.value}
        </Text>
      </TouchableOpacity>
    )}
  </View>
)

OptionViewSplit.propTypes = {
  options: PropTypes.array,
  selectOption: PropTypes.func,
  isCongruent: PropTypes.bool
}

OptionViewSplit.selected = function(arr, index, callback) {
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

OptionViewSplit.selectedExclusive = function(arr, index, callback) {
  for(let i = 0; i < arr.length; i++) {
    arr[i].selected = false;
  }
  arr[index].selected = true;
  callback(arr);
}

OptionViewSplit.selectedMultiple = function(arr, index, callback) {
  arr[index].selected = !arr[index].selected;
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
    marginRight: 4, marginLeft: 4, marginBottom: 8,
    backgroundColor: 'black',
    justifyContent: 'center',
    width: FRAME.width * 0.5 - 64
  },
  buttonOff: {
    flexGrow: 1,
    height: 48,
    borderRadius: 24,
    marginRight: 4, marginLeft: 4, marginBottom: 8,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center',
    // borderColor: Colors.BACKGROUND_GREY, borderWidth: 2,
    width: FRAME.width * 0.5 - 64
  },
  textOn: {
    fontSize: 18,
    marginLeft: 12, marginRight: 12,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  textOff: {
    fontSize: 18,
    marginLeft: 12, marginRight: 12,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-bold'
  }
});

var mapStateToProps = state => {
  return {
    fontLoaded: state.setup.fontLoaded
  }
}

export default OptionViewSplit;
