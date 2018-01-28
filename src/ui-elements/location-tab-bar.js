import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import * as LocationProfileActions from '../action-types/location-profile-action-types.js';

class LocationTabBar extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    indexOn: PropTypes.number
  }

  componentDidMount() {

  }

  bottomBar() {
    return(
      <View style={styles.bottomBar} />
    )
  }

  render() {

    return(
      <View style={styles.container} >

        <TouchableOpacity onPress={() => { this.props.dispatch({type: LocationProfileActions.OPEN_EMPLOYEES}) }} style={(this.props.indexOn === 0) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 0) ? styles.buttonTextOn : styles.buttonTextOff}>Employees</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { this.props.dispatch({type: LocationProfileActions.OPEN_DISCOUNTS}) }} style={(this.props.indexOn === 1) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 1) ? styles.buttonTextOn : styles.buttonTextOff}>Discounts</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { this.props.dispatch({type: LocationProfileActions.OPEN_NOTES}) }} style={(this.props.indexOn === 2) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 2) ? styles.buttonTextOn : styles.buttonTextOff}>Notes</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderColor: 'rgb(220,220,220)',
    borderBottomWidth: 1
  },
  buttonOff: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonOn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 3
  },
  buttonTextOn: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'roboto-regular',
    color: 'black'
  },
  buttonTextOff: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'roboto-regular',
    color: 'rgb(200, 200, 200)'
  }

});

var mapStateToProps = state => {
  return {
    indexOn: state.locationTab.indexOn
  }
}

export default connect(mapStateToProps)(LocationTabBar);
