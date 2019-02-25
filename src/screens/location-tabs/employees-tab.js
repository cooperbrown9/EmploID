import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

// import { PreloadedImage }

import * as Colors from '../../constants/colors';

const EmployeesTab = (props) => (


    <View style={styles.container}>

      {props.employees.map(model =>
        <TouchableOpacity
          style={(model.relation.role === 0) ? styles.employeeItem : (model.relation.role === 1) ? styles.employeeItemManager : styles.employeeItemOwner} key={model._id}
          onPress={() => props.onPress(model)}
        >
          <Image style={styles.employeeImage} source={(model.image_url != "" || model.image_url != null ) ? { uri: model.image_url, cache:'force-cache' } : require('../../../assets/images/chef1.png')} />
          <View style={styles.employeeInfo}>
            <Text style={{fontSize: 24, marginBottom: 6, fontFamily: 'roboto-bold'}}>{model.first_name} {model.last_name}</Text>
            <Text style={{fontSize: 18, color: 'gray', fontFamily: 'roboto-bold'}}>{model.relation.position}</Text>
          </View>
          <View style={{}}>

          </View>
        </TouchableOpacity>
      )}

    </View>
)

EmployeesTab.propTypes = {
  employees: PropTypes.array,
  onPress: PropTypes.func
};

EmployeesTab.defaultProps = {
  employees: [],
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8,
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  employeeImage: {
    height: 100,
    width: 100,
    resizeMode: 'cover'
  },
  employeeItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden'
  },
  employeeItemManager: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden',
      borderRightWidth: 16, borderColor: Colors.BLUE
  },
  employeeItemOwner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden',
      borderRightWidth: 16, borderColor: Colors.BLUE
  },
  employeeInfo: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 16
  }
});

var mapStateToProps = state => {
  return {
    employees: state.detail.employees
  }
}

export default connect(mapStateToProps)(EmployeesTab);
