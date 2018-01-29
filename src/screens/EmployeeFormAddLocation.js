import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

class EmployeeFormAddLocation extends Component {

  constructor() {
    super();

    state = {
      places: [
        { name: 'ABC', _id: '123', selected: false }
      ],
      selectedPlaces: []
    }

  }

  static propTypes = {
    dismissModal: PropTypes.func,
    addLocations: PropTypes.func,
    places: PropTypes.array
  }

  componentWillMount() {
    // this.loadLocations();

    let localPlaces = this.props.places;
    let placesCount = 0;
    for(let i = 0; i < localPlaces.length; i++) {
      localPlaces[i].selected = false;
      localPlaces[i].index = i;
      placesCount++;
      if(placesCount === localPlaces.length) {
        this.setState({ places: localPlaces });
      }
    }
  }

  loadLocations = () => {
    // DEPRECATED
    var data = {
      "sessionID": this.props.sessionID,
      "ownerID": this.props.user._id
    }

    API.getPlacesFromOwner(data, (e, response) => {
      if(e) {
        console.log(e);
        debugger;
      } else {
        for(let i = 0; i < response.length; i++) {
          response[i].selected = false;
          response[i].index = i;
          this.setState({ places: response });
        }
      }
    })
  }

  selectPlace = (place) => {
    this.state.places[place.index].selected = !this.state.places[place.index].selected;
    this.setState({ places: this.state.places });
  }

  submit() {
    let selectedPlaces = [];
    for(let i = 0; i < this.state.places.length; i++) {
      if(this.state.places[i].selected) {
        selectedPlaces.push({ "place_id": this.state.places[i]._id });
      }
    }
    this.props.addLocations(selectedPlaces);
    this.props.dismissModal();
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismissModal} />
          </View>

          <View style={styles.buttonContainer} >
            {(this.state) ? this.state.places.map((place) => (
              <TouchableOpacity
                onPress={() => this.selectPlace(place) }
                style={ ((place.selected) ? styles.buttonOn : styles.buttonOff) }
                key={place._id} >
                <Text style={(place.selected) ? styles.textOn : styles.textOff} >
                  {place.name}
                </Text>
              </TouchableOpacity>
            )) : null}
          </View>

          <View style={styles.submitButton} >
            <SubmitButton onPress={() => this.submit() } title={'SUBMIT'} />
          </View>


      </ScrollView>
    )
  }
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  submitButton: {
    marginLeft: 32, marginRight: 32, marginBottom: 64
  },
  container: {
    flex: 1
  },
  buttonContainer: {
    flex: 1
  },
  buttonOn: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 32,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 32,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-regular'
  },
  textOff: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-regular'
  },
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
});

var mapStateToProps = state => {
  return {
    user: state.user.user,
    sessionID: state.user.sessionID,
    places: state.user.myLocations
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocation);
