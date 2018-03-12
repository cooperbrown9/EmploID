import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const LocationsTab = (props) => (


    <View style={styles.container}>
        {props.locations.map(model =>
          <TouchableOpacity style={(model.detailLocationRole === 0) ? styles.restaurantItem : (model.detailLocationRole === 1) ? styles.restaurantItemManager : styles.restaurantItemOwner} key={model._id} onPress={() => props.presentModal(model)} >
              <Image style={styles.restaurantImage} source={{ uri: model.image_url }}/>

            <View style={styles.restaurantInfo}>
              <Text style={{fontSize: 20, marginBottom: 12, fontFamily: 'roboto-bold'}}>{model.name} </Text>
              <Text style={{fontSize: 16, color: 'gray', fontFamily: 'roboto-regular'}}>{model.address}</Text>
            </View>
          </TouchableOpacity>
        )}
    </View>
)

LocationsTab.propTypes = {
  locations: PropTypes.array,
  presentModal: PropTypes.func
};

LocationsTab.defaultPropTypes = {
  locations: []
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
  restaurantItemManager: {
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
    borderRadius: 4,
    borderRightWidth: 8, borderColor: 'orange'
  },
  restaurantItemOwner: {
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
    borderRadius: 4,
    borderRightWidth: 8, borderColor: 'yellow'
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

var mapStateToProps = state => {
  return {
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(LocationsTab);
