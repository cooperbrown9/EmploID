import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import NavBar from '../ui-elements/nav-bar.js';
import Menu from '../ui-elements/menu';
import {SearchBar} from 'react-native-elements';

const EmployeesScreen = (props) => (


    <View style={styles.container}>
      <SearchBar
                lightTheme
                onChangeText={() => {}}
                placeholder='Type Here...'
                 />
    </View>
)

EmployeesScreen.propTypes = {
  product: PropTypes.object.isRequired,
  dismissModal: PropTypes.func,
};





const styles = StyleSheet.create({

});

export default EmployeesScreen;
