import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = props => (
  <View style={styles.container} >
    <ActivityIndicator size="large" color="blue" />
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default LoadingOverlay;
