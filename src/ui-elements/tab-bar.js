import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import * as Colors from '../constants/colors';
import { ROBOTO } from '../constants/font';

const TabBar = props => (
  <View style={styles.container} >
    <View style={styles.subContainer} >
      <TouchableOpacity onPress={() => props.leftOnPress()} style={styles.leftIcon} >
        <Image style={styles.image} source={require('../../assets/icons/search.png')} />
      </TouchableOpacity>

      <View style={styles.elementContainer} >
        <TouchableOpacity onPress={() => props.changeTab(0)}
          style={(props.index === 0) ? styles.leftButtonOn : styles.leftButtonOff}
        >
          <Text style={styles.text}>Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.changeTab(1)}
          style={(props.index === 1) ? styles.rightButtonOn : styles.rightButtonOff}
        >
          <Text style={styles.text}>Employees</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => props.rightOnPress()} style={styles.rightIcon} >
        <Image style={styles.image} source={require('../../assets/icons/profile-male.png')} />
      </TouchableOpacity>
    </View>
  </View>
)

TabBar.propTypes = {
  changeTab: PropTypes.func,
  leftOnPress: PropTypes.func,
  rightOnPress: PropTypes.func
}

const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE,
    zIndex: 2
  },
  subContainer: {
    flex: 1,
    marginTop: (FRAME.height === 812) ? 16 : 8
  },
  image: {
    width: 24, height: 24,
    tintColor: 'white'
  },
  text: {
    fontSize: 20,
    color: 'white', fontFamily: 'roboto-bold',
    textAlign: 'center'
  },
  leftButtonOff: {
    flex: 1,
    marginRight: 16, marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightButtonOff: {
    flex: 1,
    marginLeft: 16, marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftButtonOn: {
    flex: 1,
    marginRight: 16, marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'white', borderBottomWidth: 4
  },
  rightButtonOn: {
    flex: 1,
    marginLeft: 16, marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'white', borderBottomWidth: 4
  },
  leftIcon: {
    position: 'absolute',
    left: 16, width: 32, height: 32,
    top: (FRAME.height === 812) ? 24 : 20
  },
  rightIcon: {
    position: 'absolute',
    right: 16, width: 32, height: 32,
    top: (FRAME.height === 812) ? 24 : 20
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
