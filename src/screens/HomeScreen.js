import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <View style={styles.container} >
        <Text>Came wit a beam</Text>
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
