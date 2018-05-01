import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import {SearchBar} from 'react-native-elements';

const RestaurantScreen = (props) => (


    <View style={styles.container}>
      <SearchBar lightTheme placeholder='Search' style={{marginBottom: 20}}/>
      <ScrollView
        contentContainerStyle={{marginRight: 8, marginLeft: 8}}
        refreshControl={
          <RefreshControl refreshing={props.isRefreshing} onRefresh={props.onRefresh} />
        }
      >

        {props.places.map((place) => (
          <TouchableOpacity style={styles.restaurantItem} key={place._id} onPress={() => props.openProfile(place)} >
            {(place.image_url == null)
              ? <Image
                style={{
                  height: 100, width: 100,
                  flex: 1,
                  source={require('../../assets/images/chef1.png')}
                }}
                />
              : <Image
                style={{
                  height: 100, width: 100,
                  flex: 1,
                  resizeMode: 'cover'}}
                  source={{ uri: place.image_url || null }}
              />
            }


            <View style={styles.restaurantInfo}>
              <Text style={styles.nameText}>{place.name}</Text>
              <Text style={styles.addyText}>{place.address}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

    </View>
)

RestaurantScreen.propTypes = {
  places: PropTypes.array,
  openProfile: PropTypes.func,
  isRefreshing: PropTypes.bool,
  onRefresh: PropTypes.func
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

var mapStateToProps = state => {
  return {
    places: state.user.myLocations
  }
}

export default connect(mapStateToProps)(RestaurantScreen);
