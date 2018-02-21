import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const EmployeesTab = (props) => (


    <View style={styles.container}>

      {props.employees.map(model =>
        <TouchableOpacity style={styles.employeeItem} key={model._id} >
          <Image style={styles.employeeImage} source={require('../../../assets/images/chef1.png')} />
          <View style={styles.employeeInfo}>
            <Text style={{fontSize: 24, marginBottom: 6, fontFamily: 'roboto-bold'}}>{model.first_name} {model.last_name}</Text>
            <Text style={{fontSize: 18, color: 'gray', fontFamily: 'roboto-bold'}}>{model.position}</Text>
          </View>
        </TouchableOpacity>
      )}

    </View>
)

EmployeesTab.propTypes = {
  employees: PropTypes.array
};

EmployeesTab.defaultPropTypes = {
  employees: []
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8
  },
  employeeImage: {
    height: 100,
    width: 100,
    flex: 1,
    resizeMode: 'cover'
  },
  employeeItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 8,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden'
  },
  employeeInfo: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 28
  }
});

var mapStateToProps = state => {
  return {
    employees: state.detail.employees
  }
}

export default connect(mapStateToProps)(EmployeesTab);
