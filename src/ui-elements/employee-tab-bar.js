import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import * as EmpActions from '../action-types/employee-profile-action-types.js';

class EmployeeTabBar extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    indexOn: PropTypes.number,
    handleProfile: PropTypes.func
  }


  componentDidMount() {

  }

  handleTabPress(path) {
    this.props.dispatch({ type: path });
    this.props.handleProfile(path);
  }

  render() {

    return(
      <View style={styles.container} >

        <TouchableOpacity onPress={() => this.handleTabPress(EmpActions.OPEN_PROFILE_INFO)} style={(this.props.indexOn === 0) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 0) ? styles.buttonTextOn : styles.buttonTextOff}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.handleTabPress(EmpActions.OPEN_LOCATIONS)} style={(this.props.indexOn === 1) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 1) ? styles.buttonTextOn : styles.buttonTextOff}>Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.handleTabPress(EmpActions.OPEN_DISCOUNTS)} style={(this.props.indexOn === 2) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 2) ? styles.buttonTextOn : styles.buttonTextOff}>Discounts</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.handleTabPress(EmpActions.OPEN_NOTES)} style={(this.props.indexOn === 3) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 3) ? styles.buttonTextOn : styles.buttonTextOff}>Notes</Text>
        </TouchableOpacity>

        {/*
        <TouchableOpacity onPress={() => { this.props.handleProfile(); this.props.dispatch({type: EmpActions.OPEN_NOTES}) }} style={(this.props.indexOn === 3) ? styles.buttonOn : styles.buttonOff} >
          <Text color={'black'} style={(this.props.indexOn === 3) ? styles.buttonTextOn : styles.buttonTextOff}>Notes</Text>
        </TouchableOpacity>
      */}

      </View>
    );
  }
}

// const FRAME = Dimensions.get('window');

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
    fontSize: 16, marginTop: 3,
    fontFamily: 'roboto-bold',
    color: 'black'
  },
  buttonTextOff: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'roboto-bold',
    color: 'rgb(200, 200, 200)'
  }

});

var mapStateToProps = state => {
  return {
    indexOn: state.employeeTab.indexOn

  }
}

export default connect(mapStateToProps)(EmployeeTabBar);
