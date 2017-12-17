import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { connect } from 'react-redux';

import * as Colors from '../constants/colors';
import { ROBOTO } from '../constants/font';

const TabBar = props => (
  <View style={styles.container} >

    <View style={styles.leftIcon} >
      <Image />
    </View>

    <View style={styles.elementContainer} >
      <TouchableOpacity onPress={() => props.changeTab(0)}
        style={(props.index === 0) ? styles.leftButtonOn : styles.leftButtonOff}
      >
        <Text style={styles.text}>Employees</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.changeTab(1)}
        style={(props.index === 1) ? styles.rightButtonOn : styles.rightButtonOff}
      >
        <Text style={styles.text}>Locations</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.rightIcon} >
      <Image />
    </View>

  </View>
)

TabBar.propTypes = {
  changeTab: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  },
  leftButtonOff: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightButtonOff: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftButtonOn: {
    flex: 1,
    marginRight: 16, marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'white', borderBottomWidth: 2
  },
  rightButtonOn: {
    flex: 1,
    marginLeft: 16, marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'white', borderBottomWidth: 2
  },
  leftIcon: {
    position: 'absolute',
    left: 16, top: 16, width: 32, height: 32,
    backgroundColor: 'yellow'
  },
  rightIcon: {
    position: 'absolute',
    right: 16, top: 16, width: 32, height: 32,
    backgroundColor: 'red'
  },
  elementContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginLeft: 72, marginRight: 72
  }
});

var mapStateToProps = state => {
  return {
    index: state.tab.index
  }
}

export default connect(mapStateToProps)(TabBar);
