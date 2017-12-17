import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmployeesScreen from './EmployeesScreen.js'; 
class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container} >
        <EmployeesScreen/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default HomeScreen;
