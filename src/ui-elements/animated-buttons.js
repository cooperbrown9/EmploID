import React, { Component } from 'react-native';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

class AnimatedButtons extends Component {
  render() {
    return(
      <View style={styles.container} >

      </View>
    )
  }
}

// const propTypes = {
//   spacing: PropTypes.number,
//   isOn: PropTypes.bool
// }

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center'
  },
  button: {
    height: 64, width: 64,
    backgroundColor: 'orange'
  }
})
export default AnimatedButtons;
