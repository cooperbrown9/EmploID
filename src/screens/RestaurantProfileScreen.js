import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, RefreshControl, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import LocationTabBar from '../ui-elements/location-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';

import EmployeesTab from './location-tabs/employees-tab.js';
import DiscountsTab from './location-tabs/discounts-tab.js';
import NotesTab from './location-tabs/notes-tab.js';
import RestaurantFormEdit from './RestaurantFormEdit.js';
import CreateDiscountForm from './CreateDiscountForm';
import DiscountModal from './DiscountModal';

import * as API from '../api/api';
import * as DetailActions from '../action-types/detail-action-types';
import * as NavActions from '../action-types/nav-action-types';

import * as DataBuilder from '../api/data-builder';
import * as util from '../util';

class RestaurantProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  state = {
    formModal: false,
    discountModalPresented: false,
    createDiscountModalPresented: false,
    isRefreshing: false,
    selectedDiscount: null
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    API.getRelationsByPlace(this.props.location._id, (e1, relations) => {
      if(e1) {
        console.log(e1);
      } else {
        let userIDs = [];
        relations.forEach(r => userIDs.push({ 'userID': r.user_id }) );

        const sender = {
          'users': userIDs
        }

        API.getUsers(sender, (e2, users) => {
          if(e2) {
            console.log(e2);
          } else {
            console.log(users);
            DataBuilder.assignRelationsToUsers(relations, users, (usersWithRelations) => {
              this.props.dispatch({ type: DetailActions.SET_EMPLOYEES, employees: usersWithRelations });
              this.getDiscounts();
            })
          }
        })
      }
    })
  }

  getDiscounts() {
    API.getDiscountsByPlace(this.props.location._id, (e1, discounts) => {
      if(e1) {
        console.log(e1);
        this.setState({ isRefreshing: false });
      } else {
        console.log(discounts);

        if(this.props.location.relation.role !== 1 && this.props.location.relation.role !== 2) {
          let legalDiscounts = [];
          discounts.forEach(d => (!d.exclusive) ? legalDiscounts.push(d) : console.log('lmao'));
          discounts = legalDiscounts;
        }
        this.setState({ isRefreshing: false });
        this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: discounts });
      }
    })
  }

  getDiscounts0() {
    let discounts = [];
    let count = 0;

    for(let i = 0; i < this.props.location.discounts.length; i++) {
      API.getDiscount(this.props.location.discounts[i].discount_id, (err, disc) => {
        if(err) {
          console.log(err);
          this.setState({ isRefreshing: false });
        } else {
          count++;

          if(disc.exclusive) {
            if(this.props.myRole === 2 || this.props.myRole === 1) {
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

  // called after restaurant is edited
  _updateLocation = (place) => {
    API.updateLocation(place, (err, loc) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        this.getUpdatedLocation();
      }
    });
  }

  // just gets location
  getUpdatedLocation = () => {
    API.getPlace(this.props.location._id, (err, loc) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        // relation isnt got from server so just add the already existing one to it
        // myRole is still the same also, its set on SET_LOCATION in HomeScreen
        loc.relation = this.props.location.relation;
        this.props.dispatch({ type: DetailActions.SET_LOCATION, location: loc, myRole: this.props.myRole });
        this.getUsers();
        this.getDiscounts();
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

  // make it able to present the discount thing
  _presentDiscountForm = () => {
    this.setState({ createDiscountModalPresented: true });
  }

  _presentDiscountModal = (discount) => {
    this.setState({ discountModalPresented: true, selectedDiscount: discount });
  }

  _dismissDiscountModal = () => {
    this.setState({ discountModalPresented: false });
  }

  _dismissDiscountForm = () => {
    this.setState({ createDiscountModalPresented: false });
  }

  _goBack = () => {
    this.props.dispatch({ type: NavActions.BACK });
  }

  editProfileButton() {
    if(this.props.location.relation.role === 2 || this.props.location.relation.role === 1) {
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

          {(this.props.location.image_url)
            ? <Image style={styles.profilePic} source={{ uri: this.props.location.image_url }} />
            : <View style={styles.profilePicEmpty}>
                <Text style={{fontSize:32,fontFamily:'roboto-bold',textAlign:'center', color:'gray'}}>No Image</Text>
              </View>
          }

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
            ? <DiscountsTab presentForm={() => this._presentDiscountForm()} selectDiscount={(discount) => this._presentDiscountModal(discount)} />
            : (this.props.indexOn === 2)
              ? <NotesTab />
              : null
        }

        </View>

        <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} >
          <RestaurantFormEdit updateLocation={(place) => this._updateLocation(place)} dismiss={() => this.setState({ formModal: false }, () => { this.getUpdatedLocation()})} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.createDiscountModalPresented} >
          <CreateDiscountForm dismiss={() => this._dismissDiscountForm()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} >
          <DiscountModal dismiss={() => this._dismissDiscountModal()} discount={this.state.selectedDiscount} myRole={this.props.location.relation.role} />
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
  profilePicEmpty: {
    flex: 1, zIndex: 4,
    height: FRAME.height / 8 * 5, width: FRAME.width,
    resizeMode: 'cover',
    fontSize: 32, fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
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
    location: state.detail.location,
    indexOn: state.locationTab.indexOn,
    me: state.user.user,
    myRole: state.detail.myRole
  }
}

export default connect(mapStateToProps)(RestaurantProfileScreen);
