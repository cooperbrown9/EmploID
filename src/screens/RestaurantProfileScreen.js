import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, RefreshControl, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import LocationTabBar from '../ui-elements/location-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';

import EmployeesTab from './location-tabs/employees-tab.js';
import DiscountsTab from './location-tabs/discounts-tab.js';
import NotesTab from './location-tabs/notes-tab.js';
import RestaurantFormEditOwner from './RestaurantFormEditOwner.js';
import CreateDiscountForm from './CreateDiscountForm';

import * as API from '../api/api';
import * as DetailActions from '../action-types/detail-action-types';
import * as NavActions from '../action-types/nav-action-types';

import * as util from '../util';

class RestaurantProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  state = {
    formModal: false,
    discountModalPresented: false,
    isRefreshing: false
  }

  componentDidMount() {
    // this.loadEmployees();
    // this.loadDiscounts();
    this.getUsers();
  }

  getUsers() {
    let users = [];
    let userCount = 0;

    for(let i = 0; i < this.props.location.employees.length; i++) {
      API.getUser(this.props.location.employees[i].user_id, (err, user) => {
        if(err) {
          console.log(err);
          this.setState({ isRefreshing: false });
          debugger;
        } else {
          userCount++;
          // for(let i = 0; i < user.places.length; )
          users.push(user);

          if(userCount === this.props.location.employees.length) {
            for(let i = 0; i < users.length; i++) {
              for(let j = 0; j < users[i].places.length; j++) {
                if(users[i].places[j].place_id === this.props.location._id) {
                  users[i].detailLocationRole = users[i].places[j].role;
                }
              }
            }
            // debugger;
            this.props.dispatch({ type: DetailActions.SET_EMPLOYEES, employees: users });
            this.getDiscounts();
          }
        }
      });
    }
  }

  getDiscounts() {
    let discounts = [];
    let count = 0;

    for(let i = 0; i < this.props.location.discounts.length; i++) {
      API.getDiscount(this.props.location.discounts[i].discount_id, (err, disc) => {
        if(err) {
          console.log(err);
          this.setState({ isRefreshing: false });
          debugger;
        } else {
          count++;

          if(disc.exclusive) {
            if(this.props.role === 2 || this.props.role === 1) {
              discounts.push(disc);
            }
          } else {
            discounts.push(disc);
          }

          if(count === this.props.location.discounts.length) {
            this.setState({ isRefreshing: false });
            this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: discounts });
          }
        }
      });
    }
  }

  _updateLocation = (place) => {
    API.updateLocation(place, (err, loc) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        this.getUpdatedLocation();
        // this.props.dispatch({ type: LocationDetailActions.SET_LOCATION, location: loc });
        // this.loadEmployees();
        // this.loadDiscounts();
      }
    });
  }

  getUpdatedLocation = () => {
    API.getPlace(this.props.location._id, (err, loc) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        let role = 0;
        for(let i = 0; i < this.props.user.places.length; i++) {
          if(this.props.user.places[i].place_id === loc._id) {
            role = this.props.user.places[i].role;
            break;
          }
        }
        this.props.dispatch({ type: DetailActions.SET_LOCATION, location: loc, role: role });
        this.loadEmployees();
        this.loadDiscounts();
      }
    })
  }

  // wrapper for getUpdatedLocation so it can setState
  refreshLocation = () => {
    this.setState({ isRefreshing: true}, () => {
      this.getUpdatedLocation();
    })
  }

  _dismissFormModal = () => {
    this.setState({ formModal: false });
  }

  _presentFormModal = () => {
    this.setState({ formModal: true });
  }

  _presentDiscountForm = () => {
    this.setState({ discountModalPresented: true });
  }

  _dismissDiscountForm = () => {
    this.setState({ discountModalPresented: false });
  }

  _goBack = () => {
    this.props.dispatch({ type: NavActions.BACK });
  }

  editProfileButton() {
    if(this.props.role === 2 || this.props.role === 1) {
      return (
        <View style={styles.optionsButton}>
          <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
        </View>
      )
    } else {
      return null;
    }
  }

  toPhoneNumber(num) {
    let number = '(';
    number += num.slice(0,3);
    number += ')';
    number += num.slice(3,6);
    number += '-';
    number += num.slice(6,10);
    return number;
  }

  render() {
    return (
      <ScrollView
        style={{flex:1}}
        refreshControl={ <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshLocation} />}
      >
        <View style={styles.picContainer} >
          <Image style={styles.profilePic} source={{ uri: this.props.location.image_url }} />
          <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:1000}}></View>

          <View style={styles.backButton}>
            <RoundButton onPress={this._goBack} imagePath={require('../../assets/icons/back.png')}/>
          </View>

          {this.editProfileButton()}

          <View style={styles.infoContainer} >
            <Text style={styles.infoTextName}>{this.props.location.name}</Text>
            <TouchableOpacity onPress={() => util.callPhoneNumber(this.props.location.phone)}>
              <Text style={styles.infoText}>{util.toPhoneNumber(this.props.location.phone)}</Text>
            </TouchableOpacity>
            <Text style={styles.infoText}>{this.props.location.address}</Text>
            <Text style={styles.infoText}>{this.props.location.email}</Text>
          </View>

        </View>
        <View style={{height: 64, paddingBottom: 8}}>
          <LocationTabBar />
        </View>

        <View style={styles.screenContainer} >
       {(this.props.indexOn === 0)
          ? <EmployeesTab />
          : (this.props.indexOn === 1)
            ? <DiscountsTab presentForm={() => this._presentDiscountForm()}/>
            : (this.props.indexOn === 2)
              ? <NotesTab />
              : null
        }

        </View>

        <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} >
          <RestaurantFormEditOwner updateLocation={(place) => this._updateLocation(place)} dismiss={this._dismissFormModal}/>
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} >
          <CreateDiscountForm dismiss={() => this._dismissDiscountForm()} />
        </Modal>

      </ScrollView>
    )
  }
}

const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  infoText: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 20,
    color: 'white',
    marginBottom: 8
  },
  infoTextName: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 38,
    color: 'white',
    marginBottom: 16
  },
  infoContainer: {
    position: 'absolute',
    left: 16, right: 16, bottom: 32,
    zIndex: 1001
  },
  profilePicContainer: {
    flex: 4,
  },
  profilePic: {
    flex: 1, zIndex: 1,
    height: FRAME.height / 8 * 5,
    width: FRAME.width,
    resizeMode: 'cover'
  },
  backButton: {
    position: 'absolute', left: 20, top: 20,
    zIndex: 1001
  },
  optionsButton: {
    position: 'absolute', right: 20, top: 20,
    zIndex: 1001
  },
  tabContainer: {
    height: 64
  },


});

var mapStateToProps = state => {
  return {
    employees: state.detail.employees,
    location: state.detail.location,
    indexOn: state.locationTab.indexOn,
    role: state.user.role,
    user: state.user.user
  }
}

export default connect(mapStateToProps)(RestaurantProfileScreen);
