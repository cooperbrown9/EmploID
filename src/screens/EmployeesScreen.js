import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// import NavBar from '../ui-elements/nav-bar.js';
import {SearchBar} from 'react-native-elements';
const EmployeeScreen = (props) => (


    <View style={styles.container}>
      <SearchBar lightTheme placeholder='Search' style={{marginBottom: 20}}/>
      <ScrollView styles={{paddingTop: 50}}>
        <View style={styles.employeeItem}>
          <View style={{flex:1, alignItems: 'flex-end'}}>
            <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>
          </View>
          <View style={styles.employeeInfo}>
            <Text>Ron Weasley</Text>
            <Text>Head Chef</Text>
          </View>
        </View>
        <View style={styles.employeeItem}>
          <View style={{flex:1, alignItems: 'flex-end'}}>
            <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>
          </View>
          <View style={styles.employeeInfo}>
            <Text>Ron Weasley</Text>
            <Text>Head Chef</Text>
          </View>
        </View>
        <View style={styles.employeeItem}>
          <View style={{flex:1, alignItems: 'flex-end'}}>
            <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>
          </View>
          <View style={styles.employeeInfo}>
            <Text>Ron Weasley</Text>
            <Text>Head Chef</Text>
          </View>
        </View>
        <View style={styles.employeeItem}>
          <View style={{flex:1, alignItems: 'flex-end'}}>
            <Image style={styles.employeeImage} source={require('../../assets/images/ron.png')}/>
          </View>
          <View style={styles.employeeInfo}>
            <Text>Ron Weasley</Text>
            <Text>Head Chef</Text>
          </View>
        </View>
      </ScrollView>

    </View>
)

EmployeeScreen.propTypes = {

};






const styles = StyleSheet.create({
  employeeItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 80,
      marginRight: 8,
      marginLeft: 8,
      marginTop: 2,
      marginBottom: 2,
      backgroundColor: 'purple'
    },
    employeeImage: {
      height: 60,
      borderRadius: 30,
      width: 60,
      backgroundColor: 'purple',

    },
    employeeInfo: {
      flex:3,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'yellow',
      marginLeft: 10

    }

});

export default EmployeeScreen;
