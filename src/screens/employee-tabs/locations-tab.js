import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const LocationsTab = (props) => (


    <View style={styles.container}>
        {props.places.map(model =>
          <TouchableOpacity style={styles.restaurantItem}>
              <Image style={styles.restaurantImage} source={require('../../../assets/images/rest-1.png')}/>

            <View style={styles.restaurantInfo}>
              <Text style={{fontSize: 17, marginBottom: 6}}>{model.name} </Text>
              <Text style={{fontSize: 15, color: 'gray'}}>{model.location}</Text>
            </View>
          </TouchableOpacity>
        )}
    </View>
)

LocationsTab.propTypes = {
   places: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
   })).isRequired,

};

LocationsTab.defaultPropTypes = {

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
      backgroundColor: 'white',
      overflow: 'hidden',
      borderRadius: 4
    },
    restaurantImage: {
    height: 100,
    width: null,
    flex: 1,
    resizeMode: 'cover',


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

export default LocationsTab;
