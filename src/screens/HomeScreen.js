import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions, AsyncStorage } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';
// import * as EmployeeDetailActions from '../action-types/employee-detail-action-types';
// import * as LocDetailActions from '../action-types/location-detail-action-types';
import * as DetailActions from '../action-types/detail-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';
// import * as LoadingActions from '../action-types/loading-action-types';
import * as Keys from '../constants/keys';
// import * as _ from 'lodash';

// import axios from 'axios';

import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';
import PlaceForm from './RestaurantForm';
import ProfileScreen from './ProfileScreen';

import { Camera, Permissions } from 'expo';

class HomeScreen extends Component {

  constructor() {
    super();

    this.state = {
      filterPresented: false,
      employeeFormPresented: false,
      placeFormPresented: false,
      myProfilePresented: false,
      places: [],
      employees: [],
      isRefreshing: false
    }
  }

  static navigationOptions = {
    header: null
  }

  // figure out why locations and employees dont update
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.loadPlaces();
  }

  loadPlaces() {
    let placeCount = 0;
    let places = [];
    for(let i = 0; i < this.props.user.places.length; i++) {

      API.getPlace(this.props.user.places[i].place_id, (err, place) => {
        if(err) {
          Alert.alert('ERROR LOADPLACES' + err.message);
          this.setState({ isRefreshing: false });
        } else {
          placeCount++;
          places.push(place);

          if(placeCount === this.props.user.places.length) {
            this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: places });

            // if owner (3)
            if(this.props.user.role === 3) {
              console.log('yuh');
            }

            this.loadEmployees(places);
          }
        }
      })
    }
  }

  // LEFT OFF...MAKE SURE YOU CAN ADD EMPLOYEES TO LOCATIONS AND LOCATIONS TO EMPLOYEES, THEN MAKE SURE THHEY SHOW UP ON RESPECTIVE PROFILES
  loadEmployees(locations) {
    let dirty_employees = [];

    for(let i = 0; i < locations.length; i++) {
      dirty_employees.push(...locations[i].employees);
    }

    // fuck this, had to remove duplicates, janky ass way no normal sorting works
    let employees = [];
    let match = false;
    employees.push(dirty_employees[0]);
    for(let i = 0; i < dirty_employees.length; i++) {
      for(let j = 0; j < employees.length; j++) {
        if(dirty_employees[i].user_id == employees[j].user_id) {
          match = true;
          continue;
        }
      }
      if(!match) {
        employees.push(dirty_employees[i]);
      }
      match = false;
    }

    // for(let i = 0; i < employees.length; i++) {
    //   delete employees[i]._id;
    // }

    // remove current user from employees
    // for(let i = 0; i < employees.length; i++) {
    //   if(employees[i].user_id === this.props.user._id) {
    //     employees.pop(i);
    //   }
    // }

    // let arrCopy = employees;
    // remove duplicates
    // for(let i = 0; i < employees.length - 1; i++) {
    //   for(let j = i + 1; j < employees.length; j++) {
    //     if(employees[i].user_id === employees[j].user_id) {
    //       employees.pop(j);
    //     }
    //   }
    // }

    // _.uniqBy(employees, 'user_id');


    // employees = employees.filter(this.uniqueArray);

    let employeeCount = 0;
    for(let i = 0; i < employees.length; i++) {
      API.getUser(employees[i].user_id, (err, response) => {
        if(err) {
          Alert.alert('ERROR LOAD EMPLOYEES' + err.message);
          this.setState({ isRefreshing: false });
        } else {
          employees[i] = response;
          employeeCount++;

          if(employeeCount === employees.length) {
            this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: employees });
            this.setState({ isRefreshing: false });
          }
        }
      })
    }
  }

  uniqueArray(val, index, self) {
    return self.indexOf(val) === index;
  }

  _changeTab = (index) => {
    if(this.props.places.length < 1) {
      Alert.alert('You need to add a Restaurant before you add employees!');
    } else {
      this.props.dispatch({ type: (index === 0) ? TabActions.LOCATION_TAB : TabActions.EMPLOYEE_TAB });
    }
  }

  _presentFilterModal = () => {
    this.setState({ filterPresented: true });
  }

  _dismissFilterModal = () => {
    this.setState({ filterPresented: false });
  }

  _presentAddEmployeeModal = () => {
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }
  _openEmployeeProfile = (employee) => {
    this.props.dispatch({ type: DetailActions.SET_USER, user: employee });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  _openLocationProfile = (place) => {
    this.props.dispatch({ type: DetailActions.SET_LOCATION, location: place });
    this.props.dispatch({ type: NavActions.LOCATION_PROFILE });
  }

  _dismissEmployeeModal = () => {
    this.setState({ employeeFormPresented: false });
  }

  _dismissPlaceModal = () => {
    this.setState({ placeFormPresented: false });
  }

  addPressed = () => {
    if(this.props.indexOn === 0) {
      this.setState({ placeFormPresented: true });
    } else {
      this.setState({ employeeFormPresented: true });
    }
  }

  _submitEmployeeForm(data) {
    data = {
      ...data,
      "sessionID": this.props.sessionID,
      "userID": this.props.user._id
    }

    DataBuilder.buildEmployeeForm(data, (obj) => {
      API.createUser(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(emp);
          Alert.alert('Success!');

          // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
          this.refreshUser(data, () => {
            this.loadPlaces();
          });
        }
      });
    });
  }

  _submitPlaceForm(data) {
    data = {
      ...data,
      "sessionID": this.props.sessionID,
      "userID": this.props.user._id
    }

    DataBuilder.buildPlaceForm(data, (obj) => {
      API.createPlace(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          var sessionData = {
            "sessionID": this.props.sessionID,
            "userID": this.props.user._id
          }
          this.refreshUser(sessionData, () => {
            this.loadPlaces();
          });
        }
      });
    });
  }

  // USE THIS AFTER YOU CREATE AN EMPLOYEE OR LOCATION
  refreshUser = (data, callback) => {
    API.verifySession(data, async (err, response) => {
      if(err) {
        this.props.dispatch({ type: 'START_LOGIN' });
      } else {
        this.props.dispatch({
          type: AuthActions.LOGIN_SUCCESS,
          user: response.user,
          sessionID: response.session_id,
          userID: response.user._id,
          role: response.user.role
        });
        // AFTER OWNER IS UPDATED ON REDUX, REFRESH EMPLOYEES OR LOCATIONS
        callback();
      }
    });
  }

  presentMyProfile = () => {
    this.props.dispatch({ type: DetailActions.SET_USER, user: this.props.user });
    this.setState({ myProfilePresented: true });
  }

  _dismissMyProfile = () => {
    this.setState({ myProfilePresented: false });
  }

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.loadData();
    });
  }

  clearKeys() {
    AsyncStorage.removeItem(Keys.SESSION_ID, () => {
      AsyncStorage.removeItem(Keys.USER_ID);
    });
  }

  placesEmptyElement() {
    return (
      <View style={{ }}>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this.clearKeys() } rightOnPress={() => this.presentMyProfile()} />
        </View>

        {(this.props.indexOn === 0)
          ? (this.props.places.length < 1)
            ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign:'center', fontSize: 20, fontFamily: 'roboto-bold', color: Colors.MID_GREY}}>Add a Restaurant before you add employees!</Text>
              </View>
            : <RestaurantScreen openProfile={(place) => this._openLocationProfile(place)} />
          : <EmployeeScreen isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(employee) => this._openEmployeeProfile(employee)} />
        }

        {(this.props.role === 3)
          ? <TouchableOpacity onPress={this.addPressed} style={styles.addButton} >
              <Image style={{height:64,width:64}} source={require('../../assets/icons/plus.png')} />
            </TouchableOpacity>
          : null
        }

        {/* FILTER BUTTON OUT FOR NOW
        <TouchableOpacity onPress={() => this._presentFilterModal()} style={styles.filterButton} >
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        */}

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal dismiss={() => this._dismissFilterModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.employeeFormPresented} >
          <EmployeeForm isOwner={true} places={this.state.places} submitForm={(data) => this._submitEmployeeForm(data)} dismiss={() => this._dismissEmployeeModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.placeFormPresented} >
          <PlaceForm submitForm={(data) => this._submitPlaceForm(data)} dismiss={() => this._dismissPlaceModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.myProfilePresented} >
          <ProfileScreen dismiss={() => this.setState({ myProfilePresented: false })} isMyProfile={true} />
        </Modal>

      </View>
    )
  }
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: Colors.BACKGROUND_GREY
  },
  filterButton: {
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center',
    left: 16, bottom: 16, borderRadius: 32,
    height: 64, width: FRAME.width / 2 - 32,
    backgroundColor: Colors.MID_GREY
  },
  filterText: {
    fontFamily: 'roboto-regular', fontSize: 16,
    color: Colors.DARK_GREY
  },
  addButton: {
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center',
    right: 16, bottom: 16,
    height: 64, width: 64,
    backgroundColor: 'transparent'
  },
  tabContainer: {
    height: (FRAME.height === 812) ? 84 : 72
  }
});

var mapStateToProps = state => {
  return {
    indexOn: state.tab.index,
    user: state.user.user,
    isOwner: state.user.isOwner,
    sessionID: state.user.sessionID,
    userID: state.user.userID,
    role: state.user.role,
    places: state.user.myLocations,
    employees: state.user.myEmployees
  }
}

export default connect(mapStateToProps)(HomeScreen);
