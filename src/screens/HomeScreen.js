import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';
import * as EmployeeDetailActions from '../action-types/employee-detail-action-types';
import * as LocDetailActions from '../action-types/location-detail-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';
import * as LoadingActions from '../action-types/loading-action-types';

import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';
import PlaceForm from './RestaurantForm';



class HomeScreen extends Component {

  constructor() {
    super();

    this.state = {
      filterPresented: false,
      employeeFormPresented: false,
      placeFormPresented: false,
      places: [],
      employees: []
    }
  }

  static navigationOptions = {
    header: null
  }

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
          Alert.alert(err.message);
        } else {
          placeCount++;
          places.push(place);

          if(placeCount === this.props.user.places.length) {
            this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: places });

            // if owner
            if(this.props.user.role === 3) {
              console.log('yuh');

            }

            this.loadEmployees(places);
          }
        }
      })
    }
  }

  loadEmployees(locations) {
    let employees = [];

    for(let i = 0; i < locations.length; i++) {
      employees.push(...locations[i].employees);
    }

    for(let i = 0; i < employees.length - 1; i++) {
      for(let j = 1; j < employees.length; j++) {
        if(employees[i]._id === employees[j]._id) {
          employees.pop(j);
        }
      }
    }

    let employeeCount = 0;
    for(let i = 0; i < employees.length; i++) {
      API.getUser(employees[i].employee_id, (err, response) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(response);
          employees[i] = response;
          employeeCount++;
          if(employeeCount === employees.length) {
            this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: employees });
          }
        }
      })
    }
  }

  _loadEmployees() {
    let employeeCount = 0;
    let employees = [];
    for(let i = 0; i < this.props.user.employees.length; i++) {
      API.getEmployee(this.props.user.employees[i].employee_id, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          employeeCount++;
          if(emp._id) {
            employees.push(emp);
          }

          if(employeeCount === this.props.user.employees.length) {
            this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: employees });
          }
        }
      });
    }
  }

  _changeTab = (index) => {
    this.props.dispatch({ type: (index === 0) ? TabActions.EMPLOYEE_TAB : TabActions.LOCATION_TAB });
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
    this.props.dispatch({ type: EmployeeDetailActions.SET_EMPLOYEE, employee: employee });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  _openLocationProfile = (place) => {
    this.props.dispatch({ type: LocDetailActions.SET_LOCATION, location: place });
    this.props.dispatch({ type: NavActions.LOCATION_PROFILE });
  }

  _dismissEmployeeModal = () => {
    this.setState({ employeeFormPresented: false });
  }

  _presentAddPlaceModal = () => {
    this.props.dispatch({ type: NavActions.RESTAURANT_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  _dismissPlaceModal = () => {
    this.setState({ placeFormPresented: false });
  }

  addPressed = () => {
    if(this.props.indexOn === 0) {
      this.setState({ employeeFormPresented: true });
    } else {
      this.setState({ placeFormPresented: true });
    }
  }

  _submitEmployeeForm(data) {
    data = {
      ...data,
      "sessionID": this.props.sessionID,
      "ownerID": this.props.user._id
    }
    // let jsonData = JSON.stringify(data);
    DataBuilder.buildEmployeeForm(data, (obj) => {
      debugger;
      API.createUser(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(emp);
          this.props.dispatch({ type: LoadingActions.STOP_LOADING }, () => {
            Alert.alert('Success!');
            this.setState({ employeeFormPresented: false });

          });
          debugger;


          // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
          this.refreshOwner(data, () => {
            this.loadEmployees();
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
      "ownerID": this.props.user._id
    }
    DataBuilder.buildPlaceForm(data, (obj) => {
      API.createPlace(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(emp);
          this.refreshOwner(data, () => {
            this.loadPlaces();
            this.loadEmployees();
          });
        }
      });
    });
  }

  // USE THIS AFTER YOU CREATE AN EMPLOYEE OR LOCATION
  refreshOwner = (data, callback) => {
    API.verifySessionGetOwner(data, async (err, response) => {
      if(err) {
        this.props.dispatch({ type: 'START_LOGIN' });
      } else {
        this.props.dispatch({
          type: AuthActions.LOGIN_OWNER_SUCCESS,
          user: response.owner,
          sessionID: response.session_id,
          userID: response.owner._id
        });
        // AFTER OWNER IS UPDATED ON REDUX, REFRESH EMPLOYEES OR LOCATIONS
        callback();
      }
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => console.log('left button') } rightOnPress={() => console.log('right button')} />
        </View>

        {(this.props.indexOn === 0)
          ? <EmployeeScreen openProfile={(employee) => this._openEmployeeProfile(employee)} />
        : <RestaurantScreen openProfile={(place) => this._openLocationProfile(place)} />
        }

        <TouchableOpacity onPress={this.addPressed} style={styles.addButton} >
          <Image style={{height:64,width:64}} source={require('../../assets/icons/plus.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this._presentFilterModal()} style={styles.filterButton} >
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal dismiss={() => this._dismissFilterModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.employeeFormPresented} >
          <EmployeeForm isOwner={true} places={this.state.places} submitForm={(data) => this._submitEmployeeForm(data)} dismiss={() => this._dismissEmployeeModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.placeFormPresented} >
          <PlaceForm submitForm={(data) => this._submitPlaceForm(data)} dismiss={() => this._dismissPlaceModal()} />
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
    alignItems: 'stretch'
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
    height: 72
  }
});

var mapStateToProps = state => {
  return {
    indexOn: state.tab.index,
    user: state.user.user,
    isOwner: state.user.isOwner,
    sessionID: state.user.sessionID,
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(HomeScreen);
