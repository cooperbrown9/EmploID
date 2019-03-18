import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';

import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';

import * as TabActions from '../action-types/tab-action-types';
import * as SpotlightActions from '../action-types/spotlight-action-types';

import * as Colors from '../constants/colors';
import * as query from '../util/query';

class FilterModal extends Component {

  constructor() {
    super();

    this.state = {
      jobOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Busser', selected: false, index: 3 },
        { value: 'Manager', selected: false, index: 4 },
        { value: 'Chef', selected: false, index: 5 },
        { value: 'Cook', selected: false, index: 6 },
        { value: 'Dishwasher', selected: false, index: 7 }
      ],
      genderOptions: [
        { value: 'Male', selected: false, index: 0},
        { value: 'Female', selected: false, index: 1},
        { value: 'Other', selected: false, index: 2}
      ],
      hairOptions: [
        { value: 'Brown', selected: false, index: 0},
        { value: 'Red', selected: false, index: 1},
        { value: 'Black', selected: false, index: 2},
        { value: 'Grey', selected: false, index: 3},
        { value: 'Blonde', selected: false, index: 4},
        { value: 'Other', selected: false, index: 5}
      ],
      selectedGender: null,
      selectedHair: null,
      selectedJob: null,
      selectedLocation: null
    }
  }

  static propTypes = {
    dismiss: PropTypes.func,
    employeeIDs: PropTypes.array
  }

  componentWillMount() {
    this.renderLocations();
  }

  componentDidMount() {

  }

  selectJob = (index) => {
    OptionView.selected(this.state.jobOptions, index, (arr) => {
      this.setState({ jobOptions: arr, selectedJob: arr[index].value });
    });
  }

  selectGender = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr, selectedGender: arr[index].index });
    });
  }

  selectHairColor = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr, selectedHair: arr[index].index });
    });
  }

  selectLocation(location) {
    OptionView.selected(this.state.locations, location.index, (arr) => {
      this.setState({ locations: arr, selectedLocation: location.placeID });
    })
  }

  sortFilters() {
    let data = {
      hair: this.state.selectedHair,
      gender: this.state.selectedGender,
      location: this.state.selectedLocation,
      job: this.state.selectedJob,
      userIDs: this.props.employeeIDs
    }

    query.query(data, (err, users) => {
      debugger
      this.dispatchResults(err, users);
    })
  }

  dispatchResults(err, users) {
    if(err) {
      Alert.alert('There was a problem filtering! Please check your connection and try again.');
    } else {
      this.props.dispatch({ type: TabActions.EMPLOYEE_TAB });
      this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_ON, users: users });
      this.props.dismiss();
    }
  }

  renderLocations() {
    let locs = [];
    for(let i = 0; i < this.props.locations.length; i++) {
      locs.push({
        placeID: this.props.locations[i]._id,
        value: this.props.locations[i].name,
        selected: false,
        index: i
      })
    }
    this.setState({ locations: locs });
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={styles.topBar} >
          <TouchableOpacity style={styles.leftButton} onPress={() => this.props.dismiss()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.sortFilters()} style={styles.rightButton} >
            <Text style={styles.text}>Apply</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container} >


          <Text style={styles.titleText}>Job Title</Text>
          <View style={styles.optionContainer} >
            <OptionViewSplit options={this.state.jobOptions} selectOption={(index) => this.selectJob(index)} />
          </View>

          <Text style={styles.titleText}>Gender</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.genderOptions} selectOption={(index) => this.selectGender(index)} />
          </View>

          <Text style={styles.titleText}>Hair Color</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.hairOptions} selectOption={(index) => this.selectHairColor(index)} />
          </View>

          <Text style={styles.titleText}>Restaurants</Text>
          <View style={styles.optionContainer} >
            {(this.state.locations.map((location) => (
              <TouchableOpacity style={(location.selected) ? styles.locationOn : styles.locationOff} onPress={() => this.selectLocation(location)}>
                <Text style={(location.selected) ? styles.locationTextOn : styles.locationTextOff}>{location.value}</Text>
              </TouchableOpacity>
            )))}
          </View>
          <View style={{height: 64}} />

        </ScrollView>
      </View>
    )
  }
}

// change margins based on screen size
const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  optionContainer: {
    flex: 1,
    marginLeft: 16, marginRight: 16, marginBottom: 16,
  },
  genderOptionContainer: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  jobOptionContainer: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  locationOff: {
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center'
  },
  locationOn: {
    flexGrow: 1,
    height: 48,
    borderRadius: 24,
    marginRight: 8, marginBottom: 8,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  locationTextOff: {
    fontSize: 18,
    marginLeft: 12, marginRight: 12,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  locationTextOn: {
    fontSize: 18,
    marginLeft: 12, marginRight: 12,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  titleText: {
    marginLeft: 24, marginBottom: 24,
    fontSize: 16,
    color: 'black', fontFamily: 'roboto-regular'
  },
  topBar: {
    height: (FRAME.height === 812) ? 96 : 64,
    marginBottom: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftButton: {
    marginLeft: 16, marginTop: (FRAME.height === 812) ? 48 : 24,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rightButton: {
    marginRight: 16, marginTop: (FRAME.height === 812) ? 48 : 24,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 16,
    padding: 22,
    textAlign: 'center',
    color: 'black', fontFamily: 'roboto-bold'
  }
})

var mapStateToProps = state => {
  return {
    user: state.user,
    locations: state.user.myLocations
  }
}

export default connect(mapStateToProps)(FilterModal);
