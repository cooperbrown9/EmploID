import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions, FlatList } from 'react-native';
import { BLUE, DARK_GREY, BACKGROUND_GREY, MID_GREY } from '../constants/colors';
import { callPhoneNumber } from '../util';

function renderItem({ item }, openProfile) {
  return(
    <TouchableOpacity style={styles.restaurantItem} onPress={() => openProfile(item)} key={item._id} >

      <View style={styles.restaurantInfo}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.addyText}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  )
}

const RestaurantScreen = (props) => (
  <View style={styles.container}>

    <FlatList
      style={{padding: 12, paddingTop: 16}}
      keyExtractor={(item,index) => index.toString()}
      data={props.places}
      renderItem={(place) => renderItem(place, props.openProfile)}
      onRefresh={props.onRefresh}
      refreshing={props.isRefreshing}
    />
  </View>
)

RestaurantScreen.propTypes = {
  places: PropTypes.array,
  openProfile: PropTypes.func,
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  search: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nameText: {
    fontSize: 24, marginBottom: 6,
    fontFamily: 'roboto-bold', color: 'black',
    alignSelf: 'stretch'
  },
  addyText: {
    fontSize: 18, fontFamily: 'roboto-bold',
    color: 'gray', alignSelf: 'stretch'
  },
  rightContainer: {
    flex: 1, flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center'
  },
  restaurantItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 100,
    marginTop: 4, marginBottom: 8, borderRadius: 4,
    backgroundColor: 'white',
    // overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneContainer: {
    height: 64, width: 64
  },
  phone: {
    height: 48, width:48, tintColor: 'black'
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
    marginLeft: 20, marginRight: 40
  }
});

var mapStateToProps = state => {
  return {
    places: state.user.myLocations
  }
}

export default connect(mapStateToProps)(RestaurantScreen);
