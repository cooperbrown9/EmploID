import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl, FlatList, Dimensions } from 'react-native';
// import { SearchBar } from 'react-native-elements';
import { findSimilarPlaces } from '../api/data-builder';

import ProgressiveImage from '../ui-elements/progressive-image';

import * as NavActions from '../action-types/nav-action-types';
import * as Colors from '../constants/colors';

const FRAME = Dimensions.get('window')

function formatPositions(positions) {
  let s = '';
  positions.forEach((p) => {
    s += (p + ' • ')
  });
  return s.substring(0, s.length-2);
}

function renderItem({ item }, openProfile) {
  return(
    <TouchableOpacity style={styles.employeeItem} key={item._id} onPress={() => openProfile(item)}>
        <ProgressiveImage
          style={styles.employeeImage}
          source={(item.image_url == null || item.image_url == "") ? require('../../assets/images/chef1.png') : { uri: item.image_url }}
          />

      <View style={styles.employeeInfo}>
        <Text style={styles.nameText}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.positionText}>{formatPositions(item.positions_weak)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const EmployeeScreen = (props) => (
  <View style={styles.container} >
    <FlatList
      keyExtractor={(item,index) => index.toString()}
      style={{padding: 12, height: FRAME.height + 100}}
      data={(!props.spotlightOn) ? props.employees : props.spotlightUsers}
      renderItem={(employee) => renderItem(employee, props.openProfile)}
      onRefresh={props.onRefresh}
      refreshing={props.isRefreshing}
    />
{/*

<SearchBar lightTheme placeholder={'Search'} style={{marginBottom: 20}} onChangeText={(text) => props.search(text)} />
*/}
  </View>
)

EmployeeScreen.propTypes = {
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
    fontFamily: 'roboto-bold',
    color: 'black'
  },
  positionText: {
    fontSize: 18, color: 'gray',
    fontFamily: 'roboto-bold'
  },
  employeeItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 100,
    marginTop: 4, marginBottom: 8, borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  employeeImage: {
    height: 100,
    width: 100,
    borderBottomLeftRadius: 4, borderTopLeftRadius: 16,
    // flex: 1,
  resizeMode: 'cover', overflow: 'hidden'
  },
  employeeInfo: {
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
    employees: state.user.myEmployees,
    myPlaces: state.user.myLocations,
    myID: state.user.userID,
    spotlightOn: state.spotlight.isOn,
    spotlightUsers: state.spotlight.users
  }
}

export default connect(mapStateToProps)(EmployeeScreen);
