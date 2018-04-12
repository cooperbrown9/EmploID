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


// make this page when u add a place, its "type_of_add" is a -1,0,1, -1 is removed, 0 is the same, 1 is added
//  then you send all the places to the db and sort the logic out there
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
    dismissModal: PropTypes.func,
    addLocations: PropTypes.func,
    places: PropTypes.array
  }


  // action is by default 0. If its added, its 1, if deleted its -1
  componentDidMount() {
    this.roleSelected(this.props.role);

    console.log(this.state.loading);
    this.getGroupLocations((locs) => {
      let groupPlaces = locs;
      let places = [];


      // check which ones user is already at
      groupPlaces.map((place, index) => {
        place.index = index;
        place.selected = false;
        place.action = 0;
        place.initialState = place.selected;

        places.push(place);
        for(let i = 0; i < this.props.employeePlaces.length; i++) {
          if(place._id === this.props.employeePlaces[i].place_id) {
            place.selected = true;
            place.initialState = place.selected;
          }
          if(index === groupPlaces.length - 1) {
            this.setState({ places: places });
            this.forceUpdate();
          }
        }
      });
    });
  }


  // not sure how this works but it works, gets unique array
  uniqueArray(val, index, self) {
    return self.indexOf(val) === index;
  }

  getGroupLocations = (callback) => {
    API.getLocationsInGroup(this.props.user.group_id, (err, locs) => {
      if(err) {
        console.log(err);
        this.props.dismissModal();
      } else {
        console.log(locs);
        if(!locs) {
          console.log(locs);
        } else {
          for(let i = 0; i < locs.length; i++) {
            locs[i].selected = false;
            locs[i].index = i;
          }
          callback(locs);
        }
      }
    })
  }

  // switcher, on -> off, off -> on
  selectPlace = (place) => {
    this.state.places[place.index].selected = !this.state.places[place.index].selected;

    if(this.state.places[place.index].selected) {
      this.state.places[place.index].action++;
    } else {
      this.state.places[place.index].action--;
    }

    this.setState({ places: this.state.places });
  }

  submit() {
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

    // this.props.dismissModal()
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
              this.props.dismissModal();
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
    user: state.user.user,
    employeeID: state.detail.user._id,
    role: state.detail.user.role,
    sessionID: state.user.sessionID,
    places: state.user.myLocations,
    employeePlaces: state.detail.user.places
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocationEdit);
