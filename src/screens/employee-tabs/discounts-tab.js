import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const DiscountsTab = (props) => (


    <View style={styles.container}>

        <Text>Discounts Tabular</Text>

    </View>
)

DiscountsTab.propTypes = {
  // arrayWithShape: React.PropTypes.arrayOf(React.PropTypes.shape({
  //    name: React.PropTypes.string.isRequired,
  //    image: React.PropTypes.string.isRequired,
  //    address: React.PropTypes.string.isRequired
  // })).isRequired,

};

DiscountsTab.defaultPropTypes = {

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

export default DiscountsTab;
