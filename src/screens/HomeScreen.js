import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions, AsyncStorage, Animated, LayoutAnimation } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as LoadingActions from '../action-types/loading-action-types';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';
import * as DetailActions from '../action-types/detail-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';
import * as Keys from '../constants/keys';
import * as ErrorManager from '../util/error-manager';
import * as SpotlightActions from '../action-types/spotlight-action-types';

import axios from 'axios';

import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';
import PlaceForm from './RestaurantForm';
import ProfileScreen from './ProfileScreen';
import { alphabetizeUsers, alphabetizePlaces } from '../util';

import { Camera, Permissions } from 'expo';

class HomeScreen extends Component {


// TODO

// TODO if cant create, change Alert from clicking employee tab without
// locations to say "you need to be added to restaurants"
  constructor() {
    super();

    this.alphabetizeUsers = alphabetizeUsers.bind(this);
    this.alphabetizePlaces = alphabetizePlaces.bind(this);

    this.state = {
      filterPresented: false,
      employeeFormPresented: false,
      placeFormPresented: false,
      myProfilePresented: false,
      places: [],
      employees: [],
      employeeMatches: [],
      employeeIDs: [],
      isRefreshing: false,
      animation: 1
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
    this.props.dispatch({ type: DetailActions.CLEAR });
    this.props.dispatch({ type: LoadingActions.START_LOADING });
    this.getPlaces();
  }

  getPlaces() {
    // this gets all location IDs of user (me)
    API.getRelationsByUser(this.props.userID, (e1, relations) => {
      if(e1) {
        this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
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
            this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
          } else {
            DataBuilder.assignRelationsToPlaces(relations, locations, (locationsWithRelations) => {
              let sortedLocationsWithRelations = this.alphabetizePlaces(locationsWithRelations);

              this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: sortedLocationsWithRelations });
              this.getUsers();
              // this.getUserCount();
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

    // COMBAK to keep all a user's data local, give them an array of their relations
    API.getRelationsByPlaces(sender, (err, relations) => {
      if(err) {
        this.setState({ isRefreshing: false }, () => {
          this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
          Alert.alert('Error loading Users');
        });
      } else {

        // pull userIDs off so it can be sent to the server
        let userIDs = [];
        for(let i = 0; i < relations.length; i++) {
          userIDs.push({ 'userID': relations[i].user_id });
        }
        const sender = {
          'users': userIDs
        }
        API.getUsers(sender, (err, users) => {
          if(err) {
            this.setState({ isRefreshing: false }, () => {
              this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
            });
          } else {
            this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: users });
            this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_OFF });

            this.setState({ isRefreshing: false, employeeIDs: userIDs }, () => {
              this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
            });
          }
        })
      }
    })
  }

  // takes locations on redux and puts their user count on them
  // deprecated
  getUserCount() {
    let places = [];
    let place = {};
    let itCount = 0;
    for(let i = 0; i < this.props.places.length; i++) {
      place = this.props.places[i];
      API.getUserCount(this.props.places[i]._id, (err, count) => {
        if(err) {
          place.userCount = 0;
        } else {
          place.userCount = count.user_count;
        }
        places.push(place);
        itCount++;
        if(itCount === this.props.places.length) {
          this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: places });

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
  }
  _openEmployeeProfile = (employee) => {
    this.props.dispatch({ type: DetailActions.SET_USER, user: employee });
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
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
      // this.setState({ placeFormPresented: true });
      this.props.dispatch({ type: NavActions.RESTAURANT_FORM, onBack: () => this.refreshData() });
    } else {
      this.props.dispatch({ type: NavActions.EMPLOYEE_FORM, onBack: () => this.refreshData() });
      // this.setState({ employeeFormPresented: true });
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
  // TODO deprecate this
  refreshUser = (callback) => {
    var sessionObj = { 'userID': this.props.userID, sessionID: this.props.sessionID };
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

  _searchEmployees = (text) => {
    if(text.length === 0) {
      this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_OFF });
      return;
    }

    let matches = [];
    for(let i = 0; i < this.props.employees.length; i++) {
      if((this.props.employees[i].first_name + this.props.employees[i].last_name).includes(text)) {
        matches.push(this.props.employees[i]);
      }
    }
    this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_ON, users: matches });

    // this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: matches });
  }

  _searchLocations = (text) => {
    let matches = [];
    for(let i = 0; i < this.props.places.length; i++) {
      if(this.props.places[i].name.includes(text)) {
        matches.push(this.props.places[i]);
      }
    }
    this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: matches });
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
            : <RestaurantScreen search={(text) => this._searchLocations(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(place) => this._openLocationProfile(place)} />
          : <EmployeeScreen search={(text) => this._searchEmployees(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(employee) => this._openEmployeeProfile(employee)} />
        }

        {(this.props.role === 1)
          ? <TouchableOpacity onPress={this.addPressed} style={styles.addButton} >
              <Image style={{height:64,width:64, tintColor:'black'}} source={require('../../assets/icons/plus.png')} />
            </TouchableOpacity>
          : null
        }

        {
        <TouchableOpacity onPress={() => this._presentFilterModal()} style={styles.filterButton} >
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        }

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal employeeIDs={this.state.employeeIDs} dismiss={() => this._dismissFilterModal()} />
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
    fontFamily: 'roboto-bold', fontSize: 18,
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
    employees: state.user.myEmployees,
    needReload: state.loading.needReload,
    isLoading: state.loading.isLoading,
    spotlightOn: state.spotlight.isOn,
    spotlightUsers: state.spotlight.users
  }
}

export default connect(mapStateToProps)(HomeScreen);
