import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

import OptionViewSplit from './option-view-split';
import * as Colors from '../constants/colors';

const PositionSelector = props => (
  <Animated.View style={(props.place.selected) ? styles.placeContainerOn : styles.placeContainerOff} key={props.place._id} >
    <TouchableOpacity
      onPress={() => props.selectPlace(props.place) }
      style={[styles.buttonOff, (props.place.selected) ? styles.buttonOn : {}] }
      key={props.place._id} >
      <Text style={[styles.textOff, (props.place.selected) ? styles.textOn : {}] }>
        {props.place.name}
      </Text>
    </TouchableOpacity>
    {(props.place.selected)
      ? <View style={styles.optionContainer} >
          <OptionViewSplit options={props.place.positions} selectOption={(index) => props.positionSelected(index, props.place)} />
        </View>
      : null
    }
  </Animated.View>
)

PositionSelector.propTypes = {
  place: PropTypes.object,
  selectPlace: PropTypes.func,
  positionSelected: PropTypes.func,
  animation: PropTypes.number
}

const styles = StyleSheet.create({
  placeContainerOff: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: Colors.MID_GREY,
    overflow: 'hidden'
  },
  placeContainerOn: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: 'white',//Colors.BACKGROUND_GREY,
    overflow: 'hidden',
    shadowColor: Colors.DARK_GREY, shadowOffset: { width: 0, height: 32 }, shadowRadius: 16, shadowOpacity: 1.0
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 8, marginLeft: 4, marginRight: 4,
    flex: 1,
  },
  buttonContainer: {
    flex: 1
  },
  buttonOn: {
    height: 64, //borderRadius: 24,
    marginRight: 0, marginLeft: 0, marginBottom: 16, marginTop: 0,
    backgroundColor: Colors.BLUE,//'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 64,
    // borderRadius: 24,
    marginRight: 0, marginLeft: 0, marginBottom: 16, marginTop: 0,
    backgroundColor: 'transparent', //Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 28,
    // marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  textOff: {
    fontSize: 28,
    // marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
});

export default PositionSelector;
