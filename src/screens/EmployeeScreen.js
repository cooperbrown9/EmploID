import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import {SearchBar} from 'react-native-elements';

import * as NavActions from '../action-types/nav-action-types';

import * as Colors from '../constants/colors';

const EmployeeScreen = (props) => (

    <View style={styles.container}>
      <SearchBar lightTheme placeholder={'Search'} style={{marginBottom: 20}}/>

      <ScrollView
        contentContainerStyle={{marginRight: 8, marginLeft: 8}}
        refreshControl={
          <RefreshControl refreshing={props.isRefreshing} onRefresh={props.onRefresh} />
        }
      >

        {(props.employees.length > 0) ? props.employees.map((employee) => (
          <TouchableOpacity style={styles.employeeItem} key={employee._id} onPress={() => props.openProfile(employee)}>
            <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>

            <View style={styles.employeeInfo}>
              <Text style={styles.nameText}>{employee.first_name} {employee.last_name}</Text>
              <Text style={styles.positionText}>{employee.position}</Text>
            </View>
          </TouchableOpacity>
        )) : null}

      </ScrollView>

    </View>
)

EmployeeScreen.propTypes = {
  openProfile: PropTypes.func,
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameText: {
    fontSize: 24, marginBottom: 6,
    fontFamily: 'roboto-bold',
    color: 'black'
  },
  positionText: {
    fontSize: 18, color: 'gray',
    fontFamily: 'roboto-bold'
  },
  employeeItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 100,
    marginTop: 4, marginBottom: 4, borderRadius: 4,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  employeeImage: {
    height: 100,
    width: 100,
    flex: 1,
    resizeMode: 'cover'

  },
  employeeInfo: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 20

    }

});

var mapStateToProps = state => {
  return {
    employees: state.user.myEmployees
  }
}

export default connect(mapStateToProps)(EmployeeScreen);
