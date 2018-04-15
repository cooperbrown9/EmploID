import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import * as API from '../../api/api';
import * as Colors from '../../constants/colors';
import * as DetailActions from '../../action-types/detail-action-types';

import SubmitButton from '../../ui-elements/submit-button';
import RoundButton from '../../ui-elements/round-button';
import LoadingOverlay from '../../ui-elements/loading-overlay';
import OptionView from '../../ui-elements/option-view';

// // COMBAK: cant get locations from API call to getLocationsInGroup


class EmployeeFormAddLocationEdit extends Component {

  constructor() {
    super();

    this.state = {
      places: [
        { name: 'ABC', _id: '123', selected: false }
      ],
      roleOptions: [
        { value: 'Employee', selected: true, index: 0 },
        { value: 'Manager', selected: false, index: 1 },
        { value: 'Owner', selected: false, index: 2 }
      ],
      selectedPlaces: [],
      loading: false
    }

  }

  static propTypes = {
    dismiss: PropTypes.func,
    addLocations: PropTypes.func,
    places: PropTypes.array
  }


  // action is by default 0. If its added, its 1, if deleted its -1
  componentDidMount() {
    this.roleSelected(this.props.role);

    this.getGroupLocations((places) => {

      this.props.locations.forEach(employeePlace => {
        places.forEach(groupPlace => {
          if(employeePlace._id === groupPlace._id) {
            groupPlace.selected = true;
            groupPlace.relation = employeePlace.relation;
          }
        })
      });
      this.setState({ places: places });
    });
  }

  // not sure how this works but it works, gets unique array
  uniqueArray(val, index, self) {
    return self.indexOf(val) === index;
  }

  getGroupLocations = (callback) => {
    API.getLocationsInGroup(this.props.me.group_id, (e1, places) => {
      if(e1) {
        console.log(e1);
      } else {
        places.forEach((p, index) => {
          p.selected = false
          p.index = index;
        });
        callback(places);
      }
    })
  }

  // switcher, on -> off, off -> on
  selectPlace = (place) => {
    this.state.places[place.index].selected = !this.state.places[place.index].selected;
    this.setState({ places: this.state.places });
  }

  submit() {
    this.setState({ loading: true });
    // need to pass relations to delete
    // need to pass relations to add
    let placesToDelete = [];
    let placesToAdd = [];
    for(let i = 0; i < this.state.places.length; i++) {
      // place was selected and didnt already have a relation so its been
      // added to the user
      if(this.state.places[i].selected && this.state.places[i].relation == null) {
        placesToAdd.push({ 'placeID': this.state.places[i]._id, 'userID': this.props.employeeID, 'role': 0 });
        continue;
      }

      // place was NOT selected, and had a relation, so it must be deleted
      if(!this.state.places[i].selected && this.state.places[i].relation != null) {
        placesToDelete.push({ 'relationID': this.state.places[i].relation._id });
      }
    }

    if(placesToDelete.length > 0) {
      const delSender = {
        'relations': placesToDelete
      }
      API.deleteRelations(delSender, (err, results) => {
        if(err) {
          console.log(err);
          this.setState({ loading: false });
        } else {
          console.log(results);
          this.setState({ loading: false });
        }
      })
    }

    if(placesToAdd.length > 0) {
      let count = 0;
      for(let i = 0; i < placesToAdd.length; i++) {
        API.createRelation(placesToAdd[i], (err, relation) => {
          if(err) {
            console.log(err);
            this.setState({ loading: false })
          } else {
            console.log(relation);
            count++;
            if(count === placesToAdd.length) {
              this.setState({ loading: false }, () => {
                this.props.dismiss();
              })
            }
          }
        })
      }
    }


    return;
    this.setState({ loading: true });
    let selectedPlaces = [];
    for(let i = 0; i < this.state.places.length; i++) {
      if(this.state.places[i].initialState !== this.state.places[i].selected) {
        selectedPlaces.push({ "place_id": this.state.places[i]._id, "role": 0, "selected": this.state.places[i].selected, "action": this.state.places[i].action });
      }
    }
    // this.updatePlaces();
    // this.props.addLocations(selectedPlaces);

    let data = {
      "userID": this.props.employeeID,
      "places": selectedPlaces
    }
    // debugger;

    // this.props.dismiss()
    // return;
    API.updateUserPlaces(data, (err, user) => {
      if(err) {
        console.log(err);
        Alert.alert(e.message);
        debugger;
      } else {
        API.getPlaces(this.props.employeeID, (e2, places) => {
          if(e2) {
            console.log(e2);
            Alert.alert('Couldn\'t update restaurants!');
          } else {
            this.setState({ loading: false }, () => {
              this.props.dispatch({ type: DetailActions.SET_LOCATIONS, locations: places, role: this.state.role });
              this.props.dismiss();
            });
          }
        })
      }
    })
  }

  roleSelected = (index) => {
    OptionView.selected(this.state.roleOptions, index, (arr) => {
      this.setState({ roleOptions: arr, role: index });
    });
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} />
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

          {/*
          <Text style={styles.textHeader}>Role</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.roleOptions} selectOption={(index) => this.roleSelected(index)} />
          </View>
          */}

          <View style={styles.submitButton} >
            <SubmitButton onPress={() => this.submit() } title={'SUBMIT'} />
          </View>

          {(this.state.loading)
            ? <LoadingOverlay />
            : null
          }

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
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16, marginLeft: 16, marginRight: 16,
    flex: 1,
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  },
  submitButton: {
    marginLeft: 32, marginRight: 32, marginBottom: 64
  },
  container: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 64
  },
  buttonOn: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 16,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 16,
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
    me: state.user.user,
    employeeID: state.detail.user._id,
    role: state.detail.user.role,
    sessionID: state.user.sessionID,
    places: state.user.myLocations,
    employeePlaces: state.detail.user.places,
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocationEdit);
