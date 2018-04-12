import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, RefreshControl, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import EmployeeTabBar from '../ui-elements/employee-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';

import * as API from '../api/api';

import DiscountsTab from './employee-tabs/discounts-tab.js';
import LocationsTab from './employee-tabs/locations-tab.js';
import NotesTab from './employee-tabs/notes-tab.js';
import ProfileTab from './employee-tabs/profile-tab.js';
import EmployeeFormEdit from './edit/EmployeeFormEdit';
import DiscountModal from './DiscountModal';
import UserPermissionModal from './UserPermissionModal';

import * as Parser from '../api/data-builder';
import * as NavActions from '../action-types/nav-action-types';
import * as DetailActions from '../action-types/detail-action-types';

import * as util from '../util';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  state = {
    editModalPresented: false,
    discountModalPresented: false,
    userPermissionModalPresented: false,
    selectedDiscount: null,
    isRefreshing: false,
    userPermissionModel: {}
  }

  static propTypes = {
    dismiss: PropTypes.func,
    isMyProfile: PropTypes.bool
  }

  // if something breaks check this out
  static defaultProps = {
    employee: {
      name: '',
      email: '',
      gender: '0',
      hair: '0',
      phone: '',
      places: [],
      position: ''
    },
    isMyProfile: false
  }

  componentDidMount () {
    this.getPlaces();
  }

  refreshUser = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getPlaces();
    });
  }

  getPlaces() {
    API.getRelationsByUser(this.props.employee._id, (e1, relations) => {
      if(e1) {
        console.log(e1);
        this.setState({ isRefreshing: false });
      } else {
        console.log(relations);

        let placeIDs = [];
        relations.forEach(r => placeIDs.push({ 'placeID': r.place_id }));
        let sender = {
          'places': placeIDs
        }
        API.getPlaces(sender, (e2, places) => {
          if(e2) {
            console.log(e2);
            this.setState({ isRefreshing: false });
          } else {
            console.log(places);
            this.setState({ isRefreshing: false });
            Parser.assignRelationsToPlaces(relations, places, (placesWithRelations) => {
              this.props.dispatch({ type: DetailActions.SET_LOCATIONS, locations: placesWithRelations });
              this.getDiscounts();
            })
          }
        })
      }
    })
  }

  // might change this to if owner or manager, you can see all discounts,
  // if employee, only see ones you have
  getDiscounts() {
    let placeIDs = [];
    this.props.locations.forEach(l => placeIDs.push({ 'placeID': l._id }));

    let sender = {
      'places': placeIDs
    }

    API.getDiscountsByPlaces(sender, (e1, discounts) => {
      if(e1) {
        console.log(e1);
        this.setState({ isRefreshing: false });
      } else {
        console.log(discounts);

        Parser.assignRolesToDiscounts(this.props.locations, discounts, (discountsWithRoles) => {
          this.setState({ isRefreshing: false });
          this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: discountsWithRoles });
        })
      }
    })
  }

  // DOCUMENT THIS HOLY CHRIST
  // getDiscounts0 = () => {
  //   let count = 0;
  //   let discounts = []
  //
  //   for(let i = 0; i < this.props.locations.length; i++) {
  //     discounts.push(...this.props.locations[i].discounts);
  //   }
  //
  //   for(let i = 0; i < discounts.length; i++) {
  //     API.getDiscount(discounts[i].discount_id, (err, disc) => {
  //       if(err) {
  //         console.log(err);
  //         this.setState({ isRefreshing: false });
  //       } else {
  //         count++;
  //         discounts[i] = disc;
  //
  //         if(count === discounts.length) {
  //           //START
  //           let cleanDiscounts = [];
  //
  //           for(let i = 0; i < this.props.locations.length; i++) {
  //             for(let j = 0; j < this.props.locations[i].discounts.length; j++) {
  //               for(let l = 0; l < discounts.length; l++) {
  //                 if(discounts[l]._id === this.props.locations[i].discounts[j].discount_id) {
  //                   // if employee role for this place is manager or owner
  //                   // then add it outright, otherwise
  //                   if(this.props.locations[i].employeeRoleAtLocation == 1 || this.props.locations[i].employeeRoleAtLocation == 2) {
  //                     cleanDiscounts.push(discounts[l]);
  //                   } else {
  //                     if(!discounts[l].exclusive) {
  //                       cleanDiscounts.push(discounts[l]);
  //                     }
  //                   }
  //                 } else {
  //                   continue;
  //                 }
  //               }
  //             }
  //           }
  //           //END
  //
  //           // if(this.props.role !== 2 && this.props.role !== 1) {
  //           //
  //           //   for(let i = 0; i < discounts.length; i++) {
  //           //     discounts = discounts.filter(d => d.exclusive === false);
  //           //   }
  //           // }
  //           this.setState({ isRefreshing: false });
  //           this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: cleanDiscounts });
  //         }
  //       }
  //     })
  //   }
  // }

  _dismissFormModal = () => {
    this.setState({editModalPresented: false});
  }

  _presentFormModal = () => {
    this.setState({editModalPresented: true});
  }

  _dismissDiscountModal = () => {
    this.setState({ discountModalPresented: false });
  }

  _presentDiscountModal = () => {
    if(this.props.employee._id === this.props.me._id) {
      this.setState({ discountModalPresented: true });
    }
  }

  _goBack = () => {
    if(this.props.isMyProfile) {
      this.props.dismiss();
    } else {
      this.props.dispatch({ type: NavActions.BACK });
    }
  }

  updateUserPermissions = (role, location) => {
    // update restaurant of that index for that user to the specified role
    let employeePlaces = this.props.employee.places;
    for(let i = 0; i < employeePlaces.length; i++) {
      if(employeePlaces[i].place_id === location._id) {
        employeePlaces[i].role = role;
        break;
      }
    }
    var data = {
      "userID": this.props.employee._id,
      "places": employeePlaces
    }
    API.updateUserPlaces(data, (err, user) => {
      if(err) {
        console.log('couldnt update places');
      } else {
        console.log(user);
      }
    });
  }

  editProfileButton() {
    // FIXME fix THIS

    let canEdit = true;

    if(canEdit) {
      return (
        <View style={styles.optionsButton}>
            <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
        </View>
      )
    } else {
      return null;
    }
    // OLD WAY
    // if the user (me) is a manager or owner at one of the locations of the employee,
    // then user (me) can edit
    let similarPlaces = [];
    for(let i = 0; i < this.props.me.places.length; i++) {
      for(let j = 0; j < this.props.employee.places.length; j++) {
        if(this.props.me.places[i].place_id === this.props.employee.places[j].place_id) {
          similarPlaces.push(this.props.me.places[i]);
          j = this.props.employee.places.length;
        }
      }
    }

    // let canEdit = false;
    for(let i = 0; i < similarPlaces.length; i++) {
      if(similarPlaces[i].role === 2 || similarPlaces[i].role === 1) {
        canEdit = true;
        break;
      }
    }

    if(this.props.me._id === this.props.employee._id) {
      canEdit = true;
    }
    // let similarPlaces = this.user.places.filter(p => p.place_id )
    // if(this.props.role === 1 || this.props.role === 2 || this.props.role === 3) {
    if(canEdit) {
      return (
        <View style={styles.optionsButton}>
            <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
        </View>
      )
    } else {
      return null;
    }
  }

  _presentUserPermissionModal = (model) => {
    //
    let myPlaces = this.props.me.places;
    let presentedPlace = myPlaces.find(d => d.place_id === model._id);
    if(presentedPlace.role === 1 || presentedPlace.role === 2) {
      this.setState({ userPermissionModalPresented: true, userPermissionModel: model });
    } else {
      Alert.alert('You do not have permission to edit this user!');
    }
  }

  render() {
    if(!this.props.employee) {
      return(
        <View></View>
      )
    }
    return (
        <ScrollView
          style={{flex:1}}
          refreshControl={ <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshUser} /> }
        >
          <View style={{flex: 1}}>
            <View style={styles.profilePicContainer} >

              {(this.props.employee.image_url)
                ? <Image style={styles.profilePic} source={{ uri: this.props.employee.image_url }} />
                : <View style={styles.profilePicEmpty}>
                    <Text style={{fontSize:32,fontFamily:'roboto-bold',textAlign:'center', color:'gray'}}>No Image</Text>
                  </View>
              }

              <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:1000}}></View>

              <View style={styles.backButton}>
                <RoundButton onPress={() => this._goBack()} imagePath={require('../../assets/icons/back.png')}/>
              </View>

              {this.editProfileButton()}

              <View style={styles.infoContainer} >
                <Text style={styles.infoTextName}>
                  {this.props.employee.first_name} {this.props.employee.last_name}
                </Text>
                <Text style={styles.infoText}>{this.props.employee.position}</Text>
                <TouchableOpacity onPress={() => util.callPhoneNumber(this.props.employee.phone)}>
                  <Text style={styles.infoText}>{util.toPhoneNumber(this.props.employee.phone)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{height: 64, paddingBottom: 8}}>
              <EmployeeTabBar />
            </View>

            <View style={styles.screenContainer} >

           {(this.props.indexOn === 0)
              ? <ProfileTab />
              : (this.props.indexOn === 1)
                ? <LocationsTab presentModal={(model) => this._presentUserPermissionModal(model)} />
                : (this.props.indexOn === 2)
                  ? <DiscountsTab selectDiscount={(disc) => this.setState({ selectedDiscount: disc }, () => this._presentDiscountModal())} />
                : (this.props.indexOn === 3)
                    ? <NotesTab />
                  : null
            }

            </View>

            <Modal animationType={'slide'} transparent={false} visible={this.state.editModalPresented} styles={{marginTop: 0}}>
              <EmployeeFormEdit dismiss={this._dismissFormModal} />
            </Modal>

            <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} style={styles.discountModal}>
              <DiscountModal dismiss={() => this._dismissDiscountModal()} discount={this.state.selectedDiscount} />
            </Modal>

            <Modal animationType={'slide'} transparent={false} visible={this.state.userPermissionModalPresented} style={styles.discountModal}>
              <View style={{height: 64, backgroundColor: 'transparent'}}></View>
              <UserPermissionModal updatePermission={(role, location) => this.updateUserPermissions(role, location)} location={this.state.userPermissionModel} dismiss={() => this.setState({ userPermissionModalPresented: false })} />
            </Modal>

          </View>
        </ScrollView>

    )
  }
}

const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1

  },
  infoTextName: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 38,
    color: 'white',
    marginBottom: 16
  },
  infoText: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 20,
    color: 'white',
    marginBottom: 16
  },
  infoContainer: {
    position: 'absolute',
    left: 16, right: 16, bottom: 16,
    zIndex: 1001
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  profilePicContainer: {
    flex: 4
  },
  profilePic: {
    flex: 1, zIndex: 4,
    height: FRAME.height / 8 * 5, width: FRAME.width,
    resizeMode: 'cover'
  },
  profilePicEmpty: {
    flex: 1, zIndex: 4,
    height: FRAME.height / 8 * 5, width: FRAME.width,
    resizeMode: 'cover',
    fontSize: 32, fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
  },
  backButton: {
    position: 'absolute', left: 20, top: 32,
    zIndex: 1001
  },
  optionsButton: {
    position: 'absolute', right: 20, top: 32,
    zIndex: 1001
  },
  tabContainer: {
    height: 64
  },
  discountModal: {
    marginTop: 32, marginLeft: 16, marginRight: 16, marginBottom: 32,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

var mapStateToProps = state => {
  return {
    indexOn: state.employeeTab.indexOn,
    employee: state.detail.user,
    me: state.user.user,
    role: state.user.role,
    employeeRole: state.detail.employeeRole,
    discounts: state.detail.discounts,
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(ProfileScreen);
