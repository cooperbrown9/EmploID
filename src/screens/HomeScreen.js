import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions, AsyncStorage } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';
import * as DetailActions from '../action-types/detail-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';
import * as Keys from '../constants/keys';

import axios from 'axios';

import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';
import PlaceForm from './RestaurantForm';
import ProfileScreen from './ProfileScreen';

import { Camera, Permissions } from 'expo';

class HomeScreen extends Component {


// TODO
// FIXME add employees from RestaurantForm
// FIXME Delete Users, Discounts, Locations
// people upgraded to owners cant create employees
  constructor() {
    super();

    this.state = {
      filterPresented: false,
      employeeFormPresented: false,
      placeFormPresented: false,
      myProfilePresented: false,
      places: [],
      employees: [],
      employeeMatches: [],
      isRefreshing: false
    }
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  // figure out why locations and employees dont update
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.getPlaces();
  }

  getPlaces() {
    // this gets all location IDs of user (me)
    API.getRelationsByUser(this.props.userID, (e1, relations) => {
      if(e1) {
        console.log(e1);
      } else {
        let places = [];
        for(let i = 0; i < relations.length; i++) {
          places.push({ 'placeID': relations[i].place_id });
        }

        let sender = {
          "places": places
        }

        API.getPlaces(sender, (e2, locations) => {
          if(e2) {
            console.log(e2);
          } else {
            DataBuilder.assignRelationsToPlaces(relations, locations, (locationsWithRelations) => {
              this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: locationsWithRelations });
              this.getUsers();
            })
          }
        })
      }
    })
  }

  getUsers() {
    let places = [];
    for(let i = 0; i < this.props.places.length; i++) {
      places.push({ 'placeID': this.props.places[i]._id });
    }
    const sender = {
      'places': places
    }
    // gets relations of all employees who are at my locations
    API.getRelationsByPlaces(sender, (err, relations) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        console.log('yesssss');
        let userIDs = [];
        for(let i = 0; i < relations.length; i++) {
          userIDs.push({ 'userID': relations[i].user_id });
        }
        const sender = {
          'users': userIDs
        }
        API.getUsers(sender, (err, users) => {
          if(err) {
            console.log(err);
            this.setState({ isRefreshing: false });
          } else {
            this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: users });
            this.setState({ isRefreshing: false });
          }
        })
      }
    })
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
    // get my rank compared to employee
    this.props.dispatch({ type: DetailActions.SET_USER, user: employee });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  // role based on user (me)'s role for that location
  _openLocationProfile = (place) => {
    // TODO get full relation object with full user and location
    for(let i = 0; i < this.props.places.length; i++) {
      if(this.props.places[i].relation.place_id === place._id) {
        this.props.dispatch({ type: DetailActions.SET_LOCATION, location: place, myRole: this.props.places[i].relation.role });
        this.props.dispatch({ type: NavActions.LOCATION_PROFILE });
        break;
      }
    }
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

  _submitEmployeeForm(data, places) {
    data = {
      ...data,
      "imageURL": data.imageURI,
      "sessionID": this.props.sessionID,
      "userID": this.props.me._id
    }

    if(data.imageURI == null) {
      this.__submitEmployeeHelper(data, places);
    } else {
      var img = new FormData();
      img.append('file', {
        uri: data.imageURI,
        type: 'image/png',
        name: 'testpic'
      });
      API.uploadImage(img, (err, newImage) => {
        if(err) {
          console.log(err);
        } else {
          data.imageURL = newImage;
          this.__submitEmployeeHelper(data, places);
        }
      })
    }
  }

  _submitPlaceForm(data) {
    data = {
      ...data,
      "imageURL": data.imageURI,
      "sessionID": this.props.sessionID,
      "userID": this.props.me._id,
      "groupID": this.props.me.group_id
    }

    if(data.imageURI == null) {
      this.__submitPlaceHelper(data);
    } else {
      var img = new FormData();
      img.append('file', {
        uri: data.imageURI,
        type: 'image/png',
        name: 'testpic'
      });
      API.uploadImage(img, (err, newImage) => {
        if(err) {
          console.log(err);
        } else {
          data.imageURL = newImage;
          this.__submitPlaceHelper(data);
        }
      })
    }
  }


  // creates employee then creates relations based off employee _id
  __submitEmployeeHelper = (employee, places) => {
    DataBuilder.buildEmployeeForm(employee, (obj) => {
      API.createUser(obj, (e1, emp) => {
        if(e1) {
          if(e1.status === 401) {
            Alert.alert('This email is already in use!');
          } else {
            Alert.alert('Employee could not be created at this time');
          }
        } else {
          console.log(emp);

          let relationsCreatedCount = 0;

          for(let i = 0; i < places.length; i++) {
            let relation = { 'userID': emp.user_id, 'placeID': places[i].place_id, 'role': 0, position: places[i].position }
            API.createRelation(relation, (e2, relation) => {
              if(e2) {
                console.log(e2);
              } else {
                // relationsCreatedCount++;
                if(++relationsCreatedCount === places.length) {
                  Alert.alert('Success!');

                  // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
                  this.refreshUser(employee, () => {
                    this.getPlaces();
                  });
                }
              }
            })
          }
        }
      });
    });
  }

  __submitPlaceHelper = (data) => {
    DataBuilder.buildPlaceForm(data, (obj) => {
      API.createPlace(obj, (err, place) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(place);
          Alert.alert('Success!');

          const relationData = {
            'placeID': place._id,
            'userID': this.props.me._id,
            'role': 2
          }
          API.createRelation(relationData, (err, relation) => {
            if(err) {
              console.log(err);
            } else {
              console.log(relation);

              // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
              this.refreshUser(data, () => {
                this.getPlaces();
              });
            }
          });
        }
      });
    });
  }

  // USE THIS AFTER YOU CREATE AN EMPLOYEE OR LOCATION
  refreshUser = (data, callback) => {
    var sessionObj = { 'userID': data.userID, sessionID: this.props.sessionID };
    API.verifySession(sessionObj, (err, response) => {
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
    this.props.dispatch({ type: DetailActions.SET_USER, user: this.props.me });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
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
    // return;
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

  _searchEmployees = (text) => {
    for(let i = 0; i < this.props.employees.length; i++) {
      if((this.props.employees[i].first_name + this.props.employees[i].last_name).includes(text)) {
        this.state.employeeMatches.push(this.props.employees[i]);
      }
    }
    this.setState({ employeeMatches: this.state.employeeMatches });
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
            : <RestaurantScreen isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(place) => this._openLocationProfile(place)} />
          : <EmployeeScreen search={(text) => this._searchEmployees(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(employee) => this._openEmployeeProfile(employee)} />
        }

        {(this.props.role === 1)
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
          <EmployeeForm isOwner={true} places={this.state.places} submitForm={(employee, places) => this._submitEmployeeForm(employee, places)} dismiss={() => this._dismissEmployeeModal()} />
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
    me: state.user.user,
    isOwner: state.user.isOwner,
    sessionID: state.user.sessionID,
    userID: state.user.userID,
    role: state.user.role,
    places: state.user.myLocations,
    employees: state.user.myEmployees
  }
}

export default connect(mapStateToProps)(HomeScreen);
