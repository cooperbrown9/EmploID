import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import * as API from '../api/api';

import RoundButton from '../ui-elements/round-button';

class EmployeeFormAddLocation extends Component {

  constructor(props) {
    super(props);


  }

  static propTypes = {
    dismissModal: PropTypes.func
  }

  componentDidMount() {
    this.loadLocations();
  }

  async loadLocations() {
    debugger;
    for(let i = 0; i < this.props.user.places.length; i++) {
      var data = {
        "sessionID": this.props.sessionID,
        "ownerID": this.props.user._id
      }
      API.getPlacesFromOwner(data, (e, response) => {
        if(e) {
          console.log(e);
          debugger;
        } else {
          console.log(response);
          debugger;
        }
      })
    }
  }

  render() {
    return(
      <ScrollView style={styles.container} >
        <View style={styles.container} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismissModal} />
          </View>



        </View>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
});

var mapStateToProps = state => {
  return {
    user: state.user.user,
    sessionID: state.user.sessionID
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocation);
