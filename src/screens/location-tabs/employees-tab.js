import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// import NavBar from '../ui-elements/nav-bar.js';
import {SearchBar} from 'react-native-elements';
import * as NavActions from '../../action-types/nav-action-types';
const EmployeesTab = (props) => (


    <View style={styles.container}>

      <ScrollView contentContainerStyle={{marginRight: 8, marginLeft: 8}}>
      {  // onPress={() => props.openProfile(employee._id)}  <--- This goes in Touchable Opacity
        //
        }
        {props.employees.map((employee) => (
          <TouchableOpacity style={styles.employeeItem} key={location._id} >
            <Image style={styles.employeeImage} source={require('../../../assets/images/ron.png')}/>

            <View style={styles.employeeInfo}>
              <Text style={{fontSize: 17, marginBottom: 6}}>{employee.name}</Text>
              <Text style={{fontSize: 15, color: 'gray'}}>{employee.position}</Text>
            </View>
          </TouchableOpacity>
       ))}

      </ScrollView>

    </View>
)

EmployeesTab.propTypes = {
    employees: PropTypes.arrayOf(PropTypes.shape({
       name: PropTypes.string.isRequired,
       position: PropTypes.string.isRequired,

    })).isRequired,

};

EmployeesTab.defaultPropTypes = {

};






const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default EmployeesTab;
