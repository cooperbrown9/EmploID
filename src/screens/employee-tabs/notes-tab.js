import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import RoundButton from '../../ui-elements/round-button';

const NotesTab = (props) => (
  <View style={styles.container}>

    {props.notes.map(model =>
      <TouchableOpacity style={styles.noteItem} onPress={() => props.onSelectNote(model)} key={model._id} >
        <View style={styles.noteText}>
          <Text style={{fontSize: 24, marginBottom: 6, fontFamily: 'roboto-bold'}}>{model.title} </Text>
          <Text style={{fontSize: 18, color: 'gray', fontFamily: 'roboto-regular'}}>{model.text}</Text>
      </View>
      </TouchableOpacity>
    )}

  </View>
)

NotesTab.propTypes = {
  notes: PropTypes.array,
  onSelectNote: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8,
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  noteText: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 20
  },
  noteItem: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
      backgroundColor: 'white',
      height: 100, marginTop: 4, marginBottom: 4, borderRadius: 4
  },
});

var mapStateToProps = state => {
  return {
    notes: state.detail.notes
  }
}

export default connect(mapStateToProps)(NotesTab);
