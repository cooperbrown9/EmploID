import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// import NavBar from '../ui-elements/nav-bar.js';
import {SearchBar} from 'react-native-elements';
const RestaurantScreen = (props) => (


    <View style={styles.container}>
      <SearchBar lightTheme placeholder='Search' style={{marginBottom: 20}}/>
      <ScrollView contentContainerStyle={{marginRight: 8, marginLeft: 8}}>

        <TouchableOpacity style={styles.restaurantItem}>
          <Image style={styles.restaurantImage} source={require('../../assets/images/rest-1.png')}/>

          <View style={styles.restaurantInfo}>
            <Text style={{fontSize: 17, marginBottom: 6}}>Krusty Krab </Text>
            <Text style={{fontSize: 15, color: 'gray'}}>123 Bikini Bottom</Text>
          </View>
        </TouchableOpacity>



      </ScrollView>

    </View>
)

RestaurantScreen.propTypes = {
  // arrayWithShape: React.PropTypes.arrayOf(React.PropTypes.shape({
  //    name: React.PropTypes.string.isRequired,
  //    image: React.PropTypes.string.isRequired,
  //    address: React.PropTypes.string.isRequired
  // })).isRequired,

};

RestaurantScreen.defaultPropTypes = {

};






const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  restaurantItem: {
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
    restaurantImage: {
    height: 100, width: 100,
    // width: null,
    flex: 1,
    resizeMode: 'cover'

    },
    restaurantInfo: {
      flex:3,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
      marginLeft: 20

    }

});

export default RestaurantScreen;
