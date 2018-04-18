import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { findSelectedPositions } from '../../api/data-builder';

import * as API from '../../api/api';
import * as Colors from '../../constants/colors';
import * as DetailActions from '../../action-types/detail-action-types';

import SubmitButton from '../../ui-elements/submit-button';
import RoundButton from '../../ui-elements/round-button';
import LoadingOverlay from '../../ui-elements/loading-overlay';
import OptionView from '../../ui-elements/option-view';
import OptionViewSplit from '../../ui-elements/option-view-split';

import PositionSelector from '../../ui-elements/position-selector';

class EmployeeFormAddLocationEdit extends Component {

  constructor() {
    super();

    this.findSelectedPositions = findSelectedPositions.bind(this);

    this.state = {
      places: [
        { name: 'ABC', _id: '123', selected: false }
      ],
      roleOptions: [
        { value: 'Employee', selected: true, index: 0 },
        { value: 'Manager', selected: false, index: 1 },
        { value: 'Owner', selected: false, index: 2 }
      ],
      positionOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Busser', selected: false, index: 3 },
        { value: 'Manager', selected: false, index: 4 },
        { value: 'Chef', selected: false, index: 5 },
        { value: 'Cook', selected: false, index: 6 },
        { value: 'Dishwasher', selected: false, index: 7 }
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

            // build position objects
            // groupPlace.positions.forEach((position,index) => {
            //   debugger;
            //   position = { value: position, selected: false, index: index }
            //   // groupPlace.positions[index] = { value: groupPlace.positions[index], selected: false, index: index }
            // })
          }
        })
      });

      this.setState({ places: places }, () => {
        this.state.places.forEach(place => {
          if(place.selected) {
            place.positions.forEach((position, index) => {
              if(position.value === place.relation.position) {
                position.selected = true;
              }
            })
          }
        })
        this.setState({ places: this.state.places });
      });
    });
  }

  positionSelected = (index, place) => {
    place.positions[index].selected = !place.positions[index].selected;
    for(let i = 0; i < this.state.places.length; i++) {
      if(this.state.places[i]._id === place._id) {
        this.state.places[i] = place;
        break;
      }
    }
    this.setState({ places: this.state.places });
  }

  getGroupLocations = (callback) => {
    API.getLocationsInGroup(this.props.me.group_id, (e1, places) => {
      if(e1) {
        console.log(e1);
      } else {
        places.forEach((p, index) => {
          p.selected = false
          p.index = index;
          p.positions.forEach((position, posIndex) => {
            p.positions[posIndex] = { value: position, selected: false, index: posIndex }
            if(index === places.length - 1 && posIndex === p.positions.length - 1) {
              callback(places);
            }
          });
        });

      }
    })
  }

  // switcher, on -> off, off -> on
  selectPlace = (place) => {
    this.state.places[place.index].selected = !this.state.places[place.index].selected;
    this.setState({ places: this.state.places });
  }

  submit() {
    // this.setState({ loading: true });

    let relationsToDelete = [];
    let relationsToCreate = [];

    this.state.places.forEach((place, index) => {
      // if its selected and doesnt have a relation, add it
      if(place.selected && place.relation == null) {
        let position = place.positions.find((_position) => {
          return _position.selected === true;
        });
        relationsToCreate.push({ 'placeID': place._id, 'userID': this.props.employeeID, 'role': 0, 'position': position.value });
      }
      if(!place.selected && place.relation != null) {
        relationsToDelete.push({ 'relationID': place.relation._id });
      }
    });

    let deletesComplete = false;
    let createsComplete = false;
    if(relationsToDelete.length > 0) {
      const delSender = {
        'relations': relationsToDelete
      }
      API.deleteRelations(delSender, (err, results) => {
        if(err) {
          console.log(err);
          deletesComplete = true;
        } else {
          console.log(results);
          deletesComplete = true;
        }
      });
    } else {
      deletesComplete = true;
    }

    if(relationsToCreate.length > 0) {
      const createSender = {
        'relations': relationsToCreate
      }
      API.createRelations(createSender, (err, relations) => {
        if(err) {
          console.log(err);
          createsComplete = true;
        } else {
          createsComplete = true;
        }
      });
    } else {
      createsComplete = true;
    }
    if(createsComplete && deletesComplete) {
      console.log('yuuuuup');
      this.props.dismiss();
    }
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
            <RoundButton onPress={this.props.dismiss} imagePath={require('../../../assets/icons/down.png')} />
          </View>

          <View style={styles.buttonContainer} >
            {(this.state) ? this.state.places.map((place) => (
              <PositionSelector
                place={place}
                selectPlace={(place) => this.selectPlace(place)}
                positionSelected={(index, place) => this.positionSelected(index, place)}
              />
            )) : null}
          </View>

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
    employee: state.detail.user,
    employeeID: state.detail.user._id,
    role: state.detail.user.role,
    sessionID: state.user.sessionID,
    places: state.user.myLocations,
    employeePlaces: state.detail.user.places,
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocationEdit);
