import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingOverlay = props => (
  <View style={styles.container} >
    <ActivityIndicator size="large" color="white" />
  </View>
)

LoadingOverlay.propTypes = {
  text: PropTypes.string
}

LoadingOverlay.defaultProps = {
  text: ''
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // left: 0, right: 0, top: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999
  }
});

export default LoadingOverlay;
