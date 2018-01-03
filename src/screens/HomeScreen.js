import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as EmployeeProfileActions from '../action-types/employee-profile-action-types';
import * as RestaurantProfileActions from '../action-types/restaurant-profile-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';

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
    this.loadEmployees();
    this.loadPlaces();
  }


  loadEmployees() {
    let employeeCount = 0;
    let employees = [];
    for(let i = 0; i < this.props.user.employees.length; i++) {
      API.getEmployee(this.props.user.employees[i].employee_id, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          employeeCount++;
          employees.push(emp);
          console.log(emp);

          if(employeeCount === this.props.user.employees.length) {
            console.log(employees);
            this.setState({ employees: employees });
          }
        }
      })
    }
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
          // console.log(place);

          if(placeCount === this.props.user.places.length) {
            // console.log(places);
            this.setState({ places: places });
          }
        }
      })
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
  _openEmployeeProfile = (id) => {
    this.props.dispatch({ type: EmployeeProfileActions.GET_EMPLOYEE_ID, employeeID: id });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  _openRestaurantProfile = (id) => {
    this.props.dispatch({ type: RestaurantProfileActions.GET_RESTAURANT_ID, employeeID: id });
    this.props.dispatch({ type: NavActions.RESTAURANT_PROFILE });
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
    debugger;
    DataBuilder.buildEmployeeForm(data, (obj) => {
      API.createEmployee(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(emp);
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
        }
      });
    });
  }

  render() {
    let g = 100;
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this._presentFilterModal() } rightOnPress={() => this._presentAddEmployeeModal()} />
        </View>

        {(this.props.indexOn === 0)
          ? <EmployeeScreen employees={this.state.employees} openProfile={(id) => this._openEmployeeProfile(id)} />
        : <RestaurantScreen places={this.state.places} openProfile={(id) => this._openRestaurantProfile(id)}/>
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
          <EmployeeForm places={this.state.places} submitForm={(data) => this._submitEmployeeForm(data)} dismiss={() => this._dismissEmployeeModal()} />
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
    sessionID: state.user.sessionID,
    userID: state.user.userID
  }
}

export default connect(mapStateToProps)(HomeScreen);
