import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, RefreshControl, Animated, LayoutAnimation } from 'react-native';
import {SearchBar} from 'react-native-elements';
import { BLUE, DARK_GREY, BACKGROUND_GREY, MID_GREY } from '../constants/colors';
import { callPhoneNumber } from '../util';

const RestaurantScreen = (props) => (
  <View style={styles.container}>
    <SearchBar lightTheme placeholder='Search' style={{marginBottom: 20}} onChangeText={(text) => props.search(text)} />
    <ScrollView
      contentContainerStyle={{marginRight: 8, marginLeft: 8}}
      refreshControl={
        <RefreshControl refreshing={props.isRefreshing} onRefresh={props.onRefresh} />
      }
    >

      {props.places.map((place) => (
          <TouchableOpacity style={styles.restaurantItem} onPress={() => props.openProfile(place)} >

            <View style={styles.restaurantInfo}>
              <Text style={styles.nameText}>{place.name}</Text>
              <Text style={styles.addyText}>{place.address}</Text>
            </View>
            {/*
            <View style={styles.rightContainer} >
              <TouchableOpacity style={styles.phoneContainer} onPress={() => callPhoneNumber(place.phone)} >
                <Image style={styles.phone} resizeMode={'contain'} source={require('../../assets/icons/phone-flat.png')} />
              </TouchableOpacity>
            </View>
            */}
          </TouchableOpacity>
      ))}

    </ScrollView>

  </View>
)
// this goes right below the right container
  // <View style={{flexDirection: 'row'}} >
  // <Image style={styles.userImage} source={require('../../assets/icons/users.png')} />
  // <Text style={styles.userCount}>: 100</Text>
  // </View>

RestaurantScreen.toggleOptions = function(place, props) {
  props.toggleOptions(place);
  var animationProps = {
    type: 'timing',
    // springDamping: 0.8,
    property: 'opacity'
  }

  var animationConfig = {
    duration: 250,
    create: animationProps,
    update: animationProps
  }
  LayoutAnimation.configureNext(animationConfig);
}

RestaurantScreen.propTypes = {
  places: PropTypes.array,
  openProfile: PropTypes.func,
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  search: PropTypes.func,
  toggleOptions: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameText: {
    fontSize: 24, marginBottom: 6,
    fontFamily: 'roboto-bold', color: 'black'
  },
  addyText: {
    fontSize: 18, fontFamily: 'roboto-bold',
    color: 'gray'
  },
  userCount: {
    fontSize: 16, fontFamily: 'roboto-bold', color: DARK_GREY
  },
  userImage: {
    height:16, width: 16, tintColor: DARK_GREY
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
    marginTop: 4, marginBottom: 4, borderRadius: 4,
    backgroundColor: 'white',
    overflow: 'hidden'
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
