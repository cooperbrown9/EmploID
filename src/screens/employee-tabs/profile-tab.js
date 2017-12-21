import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const ProfileTab = (props) => (


    <View style={styles.container}>

        <Text>Profile Tabular</Text>

    </View>
)

ProfileTab.propTypes = {
  // arrayWithShape: React.PropTypes.arrayOf(React.PropTypes.shape({
  //    name: React.PropTypes.string.isRequired,
  //    image: React.PropTypes.string.isRequired,
  //    address: React.PropTypes.string.isRequired
  // })).isRequired,

};

ProfileTab.defaultPropTypes = {

};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8
  },
  restaurantItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100,
      marginTop: 4,
      marginBottom: 4,
      backgroundColor: 'white'
    },
    restaurantImage: {
    height: 100,
    width: null,
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 4

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

export default ProfileTab;
