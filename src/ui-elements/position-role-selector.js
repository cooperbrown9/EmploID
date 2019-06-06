import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import OptionView from './option-view';
import OptionViewSplit from './option-view-split';

import { BLUE, MID_GREY } from '../constants/colors';

const PositionRoleSelector = props => (
  <View>
    <View style={styles.optionContainer} >
      <OptionViewSplit options={props.parent.positions} selectOption={(index) => props.onPositionSelected(index, props.parent)} />
    </View>
    <View style={{ height: 8, backgroundColor: MID_GREY, alignSelf: 'stretch', marginBottom: 12, justifyContent: 'center' }} />
    <View style={styles.optionContainer} >
      <OptionView options={props.parent.roles} selectOption={(index) => props.onRoleSelected(index, props.parent)} />
    </View>
  </View>
)

// parent is the same employee or place, just the object that is in question
PositionRoleSelector.propTypes = {
  parent: PropTypes.object.isRequired,
  onPositionSelected: PropTypes.func.isRequired,
  onRoleSelected: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 8, marginLeft: 4, marginRight: 4,
    flex: 1,
  },
})

export default PositionRoleSelector;
