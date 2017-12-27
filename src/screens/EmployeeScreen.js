import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// import NavBar from '../ui-elements/nav-bar.js';
import {SearchBar} from 'react-native-elements';
const EmployeeScreen = (props) => (


    <View style={styles.container}>
      <SearchBar lightTheme placeholder={'Search'} style={{marginBottom: 20}}/>
      <ScrollView contentContainerStyle={{marginRight: 8, marginLeft: 8}}>

        <TouchableOpacity style={styles.employeeItem} >
          <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>

          <View style={styles.employeeInfo}>
            <Text style={{fontSize: 17, marginBottom: 6}}>Ron Weasley </Text>
            <Text style={{fontSize: 15, color: 'gray'}}>Head Chef</Text>
          </View>
        </TouchableOpacity>


      </ScrollView>

    </View>
)

EmployeeScreen.propTypes = {
  // arrayWithShape: React.PropTypes.arrayOf(React.PropTypes.shape({
  //    name: React.PropTypes.string.isRequired,
  //    position: React.PropTypes.string.isRequired,
  //    picture: React.PropTypes.string.isRequired,
  //    phoneNumber: React.PropTypes.string.isRequired,
  //    hairColor: ReactPropTypes.string.isRequired
  // })).isRequired,

};

_onPressEmployee = () =>
{

}





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

export default EmployeeScreen;
