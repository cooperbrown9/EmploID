import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const DiscountsTab = (props) => (


    <View style={styles.container}>

      {props.discounts.map(model =>
        <TouchableOpacity style={styles.discountItem}>
          <View style={styles.discountInfo}>
            <Text style={{fontSize: 17, marginBottom: 6, fontFamily: 'roboto-regular'}}>{model.name} </Text>
            <Text style={{fontSize: 15, color: 'gray', fontFamily: 'roboto-regular'}}>{model.address}</Text>
        </View>
        </TouchableOpacity>
      )}

    </View>
)

DiscountsTab.propTypes = {
  discounts: PropTypes.array
};

DiscountsTab.defaultPropTypes = {
  discounts: [
    { name: 'BOGO 50%', location: 'Poquitos' },
    { name: 'Get 10% off Any Item', location: 'Rhein Haus' }
  ]
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8
  },
  discountItem: {
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
  discountInfo: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 20
  }
});

export default DiscountsTab;
