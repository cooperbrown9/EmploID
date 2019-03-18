import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert,
  Dimensions, AsyncStorage, LayoutAnimation, Platform, StatusBar, Animated
} from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';

import * as LoadingActions from '../action-types/loading-action-types';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as DetailActions from '../action-types/detail-action-types';
import * as PermissionActions from '../action-types/permission-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';
import * as Keys from '../constants/keys';
import * as SpotlightActions from '../action-types/spotlight-action-types';
import * as util from '../util';
import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import LoadingOverlay from '../ui-elements/loading-overlay';
import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';
import PlaceForm from './RestaurantForm';
import ProfileScreen from './ProfileScreen';
import MyDiscountScreen from './MyDiscountScreen';

import { alphabetizeUsers, alphabetizePlaces } from '../util';
// import { preloadedImages, PreloadedImage } from 'react-native-preload-images';
// import AnimatedButtons from '../ui-elements/animated-buttons';

class HomeScreen extends Component {

  constructor() {
    super();

    this.alphabetizeUsers = alphabetizeUsers.bind(this);
    this.alphabetizePlaces = alphabetizePlaces.bind(this);

    this.state = {
      canCreateUsers: false,
      filterPresented: false,
      employeeFormPresented: false,
      myDiscountsPresented: false,
      placeFormPresented: false,
      myProfilePresented: false,
      places: [],
      employees: [],
      employeeMatches: [],
      employeeIDs: [],
      isRefreshing: false,
      animation: 1,
      optionButtonAnimation: new Animated.Value(-100),
      tabAnimation: new Animated.Value(0),
      isOptionsAvailable: false
    }
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  componentWillMount() {
    // this.loadData();

  }
  componentDidMount() {
    // NOTE moved to willMount
    this.loadData()
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
        // checks if user is manager or owner at any of their locations
        let canCreateUsers = util.checkCanCreateUsers(relations);
        this.props.dispatch({ type: PermissionActions.SET_IS_USER_CREATOR, isCreator: canCreateUsers });

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
            // isToggled is used for determining if the item is open or not
            locations.map((l) => { l.isToggled = false });

            DataBuilder.assignRelationsToPlaces(relations, locations, (locationsWithRelations) => {
              let sortedLocationsWithRelations = this.alphabetizePlaces(locationsWithRelations);

              this.props.dispatch({ type: AuthActions.SET_LOCATIONS, locations: sortedLocationsWithRelations });
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

    // NOTE gets relations of all employees who are at my locations
    API.getRelationsByPlaces(sender, (err, relations) => {
      if(err) {
        this.setState({ isRefreshing: false }, () => {
          this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
          Alert.alert('Error loading Users');
        });
      } else {

        // pull userIDs off so it can be sent to the server
        // userIDs of all the relations
        let userIDs = [];
        for(let i = 0; i < relations.length; i++) {
          userIDs.push({ 'userID': relations[i].user_id });
        }
        const sender = {
          'users': userIDs
        }
        API.getUsers(sender, async(err, users) => {
          if(err) {
            this.setState({ isRefreshing: false }, () => {
              this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
            });
          } else {
            // await Promise.all(...this.cacheImages(users)).then((result) => {
              // Promise.all([this.cacheImages(users)])
              // .then((status) => {
              // this.loadImages(users)
              // console.log(status)
              DataBuilder.assignPositionsToUsers(users, relations, (users) => {
                this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: users });
                this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_OFF });

                this.setState({ isRefreshing: false, employeeIDs: userIDs }, () => {
                  this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
                });
              })
              // })
              // .catch((e) => {
              // debugger
              // })
              // this.cacheImages(users)
              // this.props.dispatch({ type: AuthActions.SET_EMPLOYEES, employees: users });
              // this.props.dispatch({ type: SpotlightActions.SPOTLIGHT_OFF });
              //
              // this.setState({ isRefreshing: false, employeeIDs: userIDs }, () => {
              //   this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: false });
              // });
            // }).catch((e) => console.log('couldnt cache images'))
          }
        })
      }
    })
  }

  // loadImages(users) {
  //   let images = []
  //   users.forEach((user) => {
  //     images.push({ name: user._id, uri: user.image_url })
  //   })
  //   preloadImages(images)
  // }

  // NOTE image_url like users[0].image_url
  // NOTE called on line 157
  cacheImages(users) {
    return users.map((user) => {
      console.log(user.image_url)
      // let img = Image.prefetch(user.image_url).then((data) => {
      //   console.log(data)
      // })

      // debugger
      return Image.prefetch(user.image_url)
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
    this.onTabSwitch();
  }

  _presentMyDiscounts = () => {
    this.setState({ myDiscountsPresented: true });
  }

  _presentFilterModal = () => {
    this.setState({ filterPresented: true });
  }

  _dismissFilterModal = () => {
    this.setState({ filterPresented: false });
  }

  _presentAddEmployeeModal = () => {
    this.props.navigation.navigate(NavActions.EMPLOYEE_PROFILE);
  }
  _openEmployeeProfile = (employee) => {
    this.props.dispatch({ type: DetailActions.SET_USER, user: employee });
    this.props.navigation.navigate(NavActions.EMPLOYEE_PROFILE);
  }

  // role based on user (me)'s role for that location
  _openLocationProfile = (place) => {
    for(let i = 0; i < this.props.places.length; i++) {
      if(this.props.places[i].relation.place_id === place._id) {
        this.props.dispatch({ type: DetailActions.SET_LOCATION, location: place, myRole: this.props.places[i].relation.role });
        this.props.navigation.navigate(NavActions.LOCATION_PROFILE);
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
    this.onOptions()
    return;
    // if(this.props.indexOn === 0) {
    //   this.props.navigation.navigate(NavActions.RESTAURANT_FORM, {
    //     onBack: () => this.refreshData()
    //   });
    // } else {
    //   this.props.navigation.navigate(NavActions.EMPLOYEE_FORM, {
    //     onBack: () => this.refreshData()
    //   });
    // }
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
        this.props.navigation.navigate(NavActions.LOGIN);
      } else {
        this.props.dispatch({
          type: AuthActions.LOGIN_SUCCESS,
          user: response.user,
          sessionID: response.session_id,
          userID: response.user._id,
          role: response.user.role,
          canCreatePlaces: response.user.can_create_places
        });
        // AFTER OWNER IS UPDATED ON REDUX, REFRESH EMPLOYEES OR LOCATIONS
        callback();
      }
    });
  }

  presentMyProfile = () => {
    this.props.dispatch({ type: DetailActions.SET_USER, user: this.props.me });
    this.props.navigation.push(NavActions.EMPLOYEE_PROFILE);
  }

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.loadData();
    });
  }

  checkCreatePermission() {
    // loop thru all relations and check if any of them are >= 1
    // if so, display the add icon only on employees
    let addButton = (
      <TouchableOpacity onPress={this.addPressed} style={[styles.addButton, {backgroundColor:Colors.BLACK}]} >
          <Image style={{height:48,width:48, tintColor:'white'}} source={require('../../assets/icons/ellipsis.png')} />
      </TouchableOpacity>
    );

    if(this.props.indexOn === 0 && this.props.me.can_create_places) {
      return addButton;
    }

    if(this.props.indexOn === 1 && this.props.me.can_create_places) {
      return addButton;
    }
  }

  renderOptionToggle = () => {
    let toggle = (
      <TouchableOpacity onPress={this.addPressed} style={[styles.addButton, {backgroundColor:Colors.BLACK}]} >
          <Image style={{height:48,width:48, tintColor:'white'}} source={require('../../assets/icons/ellipsis.png')} />
      </TouchableOpacity>
    );
    return toggle;
  }

  onAdd = () => {
    if(this.props.indexOn === 0) {
      this.props.navigation.navigate(NavActions.RESTAURANT_FORM, {
        onBack: () => this.refreshData()
      });
    } else {
      this.props.navigation.navigate(NavActions.EMPLOYEE_FORM, {
        onBack: () => this.refreshData()
      });
    }
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

  onOptions = () => {
    Animated.timing(this.state.optionButtonAnimation,
    {
      toValue: (this.state.onOptions) ? - 72 : 16,
      duration: 250
    }).start()
    this.setState({ onOptions: !this.state.onOptions })
  }

  onTabSwitch() {
    Animated.timing(this.state.tabAnimation,
    {
      toValue: (this.props.indexOn == 1) ? 0 : -FRAME.width,
      duration: 250
    }).start()
  }

  render() {
    return (
      <Animated.View style={styles.container} >
        <StatusBar hidden={false} barStyle={'light-content'} />
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this.clearKeys() } rightOnPress={() => this.presentMyProfile()} />
        </View>

        {/*(this.props.indexOn === 0)
          ? (this.props.places.length < 1)
            ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign:'center', fontSize: 20, fontFamily: 'roboto-bold', color: Colors.MID_GREY}}>Add a Restaurant before you add employees!</Text>
              </View>
            : <RestaurantScreen search={(text) => this._searchLocations(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(place) => this._openLocationProfile(place)} />
          : <EmployeeScreen search={(text) => this._searchEmployees(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(employee) => this._openEmployeeProfile(employee)} />
        */
        (this.props.places.length < 1)
          ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign:'center', fontSize: 20, fontFamily: 'roboto-bold', color: Colors.MID_GREY}}>Add a Restaurant before you add employees!</Text>
            </View>
          : <Animated.View style={[styles.animatedView, {left: this.state.tabAnimation,flexDirection:'column'}]}>
            <View style={{flex: 1,flexDirection:'row'}}>
              <RestaurantScreen style={{shadowOpacity: this.state.tabAnimation}} search={(text) => this._searchLocations(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(place) => this._openLocationProfile(place)} />
              <EmployeeScreen search={(text) => this._searchEmployees(text)} isRefreshing={this.state.isRefreshing} onRefresh={() => this.refreshData()} openProfile={(employee) => this._openEmployeeProfile(employee)} />
            </View>
            </Animated.View>
        }

        {this.renderOptionToggle()}

        <Animated.View style={[styles.addButton, { bottom: 170, right: this.state.optionButtonAnimation, backgroundColor:'transparent'}]} >
          {(this.props.me.can_create_places)
            ? <TouchableOpacity style={styles.optionTouch} onPress={this.onAdd} >
                <Image source={require('../../assets/icons/add.png')} style={{width:32, height: 32,tintColor:'white'}}/>
              </TouchableOpacity>
            : null
          }
          <TouchableOpacity style={styles.optionTouch} onPress={this.presentMyProfile}>
            <Image source={require('../../assets/icons/profile.png')} style={{width:32, height: 32,tintColor:'white'}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionTouch} onPress={this._presentMyDiscounts}>
            <Image source={require('../../assets/icons/card.png')} style={{width:32, height: 32,tintColor:'white'}}/>
          </TouchableOpacity>


        </Animated.View>

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

        <Modal animationType={'slide'} transparent={true} visible={this.state.myDiscountsPresented} >
          <MyDiscountScreen onDismiss={() => this.setState({ myDiscountsPresented: false })} />
        </Modal>

        {(this.props.isLoading && !this.state.isRefreshing)
          ? <LoadingOverlay />
          : null
        }

      </Animated.View>
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
    backgroundColor: Colors.MID_GREY,
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  filterText: {
    fontFamily: 'roboto-bold', fontSize: 18,
    color: Colors.DARK_GREY
  },
  addButton: {
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center',
    right: 16, bottom: 16,
    height: 72, width: 72, borderRadius: 36,
    backgroundColor: 'transparent',
    shadowColor: Colors.BLACK, shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  tabContainer: {
    marginBottom: 16,
    height: (FRAME.height === 812 || FRAME.height === 896) ? 90 : 72,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  optionTouch: {
    borderRadius:32, height: 64, width: 64, marginBottom: 12,
    backgroundColor: Colors.YELLOW,
    justifyContent:'center',alignItems:'center'
  },
  animatedView: {
    position: 'absolute',
    flexDirection: 'row',
    width: FRAME.width * 2,
    top: (FRAME.height === 812 || FRAME.height === 896) ? 90 : 72,
    bottom: 0,
    left: 0
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
    spotlightUsers: state.spotlight.users,
    canCreateUsers: state.permission.isUserCreator,
    canCreatePlaces: state.permission.isCreator
  }
}

export default connect(mapStateToProps)(HomeScreen);
