import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { BLUE } from '../constants/colors';

const DataButton = props => (
  <TouchableOpacity onPress={() => props.onPress()} style={[styles.container, {backgroundColor:props.bgColor}]}>
    <Text style={styles.text}>{props.title}</Text>

    {(props.data !== null)
      ? <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{props.data}</Text>
        </View>
      : null
    }

  </TouchableOpacity>
)

DataButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  bgColor: PropTypes.string,
  data: PropTypes.string
}

DataButton.defaultProps = {
  title: 'Submit',
  bgColor: BLUE,
  data: null
}

const styles =  StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'row',
    height: 64,
    borderRadius: 8,
    backgroundColor: BLUE,
    justifyContent: 'space-around', alignItems: 'center',
    overflow: 'hidden'
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    fontFamily: 'roboto-bold',
    borderRadius: 16
  },
  dataContainer: {
    height: 32, width: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden'
  },
  dataText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    color: BLUE,
    fontFamily: 'roboto-bold'
  }
})

export default DataButton;
