import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Modal} from 'react-native';
import { connect } from 'react-redux';
import EmployeeTabBar from '../ui-elements/employee-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';

import * as API from '../api/api';

import DiscountsTab from './employee-tabs/discounts-tab.js';
import LocationsTab from './employee-tabs/locations-tab.js';
import NotesTab from './employee-tabs/notes-tab.js';
import ProfileTab from './employee-tabs/profile-tab.js';
import EmployeeFormEditOwner from './edit/EmployeeFormEditOwner';

import * as NavActions from '../action-types/nav-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';
import * as EmployeeDetailActions from '../action-types/employee-detail-action-types';
import * as DetailActions from '../action-types/detail-action-types';


class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    formModal: false,
    places: [],
    name: null
  }

  static defaultPropTypes = {
    employee: {
      name: '',
      email: '',
      gender: '0',
      hair: '0',
      phone: '',
      places: [],
      position: ''
    }
  }

  componentDidMount () {
    this.getPlaces();
  }

  getPlaces() {
    let placesCount = 0;
    let places = [];

    for(let i = 0; i < this.props.employee.places.length; i++) {
      API.getPlace(this.props.employee.places[i].place_id, (err, response) => {
        if(err) {
          console.log(err);
        } else {
          placesCount++;
          places.push(response);

          if(placesCount === this.props.employee.places.length) {
            this.props.dispatch({ type: DetailActions.SET_LOCATIONS, locations: places });
            this.getDiscounts();
          }
        }
      })
    }
  }

  getDiscounts = () => {
    let count = 0;
    let discounts = []

    for(let i = 0; i < this.props.locations.length; i++) {
      discounts.push(...this.props.locations[i].discounts);
    }

    for(let i = 0; i < discounts.length; i++) {
      API.getDiscount(discounts[i].discount_id, (err, disc) => {
        if(err) {
          console.log(err);
          debugger;
        } else {
          count++;
          discounts[i] = disc;

          if(count === discounts.length) {
            this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: discounts });
          }
        }
      })
    }
  }

  _dismissFormModal = () => {
    this.setState({formModal: false});
  }

  _presentFormModal = () => {
    this.setState({formModal: true});
  }

  _goBack = () => {
    this.props.dispatch({ type: NavActions.BACK });
  }

  editProfileButton() {
    if(this.props.role === 3 || this.props.role === 2) {
      return (
        <View style={styles.optionsButton}>
            <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
        </View>
      )
    } else {
      return null;
    }
  }

  render() {
    if(!this.props.employee) {
      return(
        <View></View>
      )
    }
    return (
        <ScrollView style={{flex:1}}>
          <View style={{flex: 1}}>
            <View style={styles.profilePicContainer} >

              <Image style={styles.profilePic} source={require('../../assets/images/chef1.png')} />

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
                <Text style={styles.infoText}>{this.props.employee.phone}</Text>
              </View>
            </View>

            <View style={{height: 64, paddingBottom: 8}}>
              <EmployeeTabBar />
            </View>

            <View style={styles.screenContainer} >

           {(this.props.indexOn === 0)
              ? <ProfileTab />
              : (this.props.indexOn === 1)
                ? <LocationsTab />
                : (this.props.indexOn === 2)
                  ? <DiscountsTab />
                : (this.props.indexOn === 3)
                    ? <NotesTab />
                  : null
            }

            </View>

            <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} styles={{marginTop: 0}}>
              <EmployeeFormEditOwner dismiss={this._dismissFormModal} />
            </Modal>
          </View>
        </ScrollView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  },
  infoTextName: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-regular', fontSize: 40,
    color: 'white',
    marginBottom: 16
  },
  infoText: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-regular', fontSize: 24,
    color: 'white',
    marginBottom: 8
  },
  infoContainer: {
    position: 'absolute',
    left: 16, right: 120, bottom: 32,
    zIndex: 1001
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  profilePicContainer: {
    flex: 4,
  },
  profilePic: {
    flex: 1, zIndex: 1
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
    indexOn: state.employeeTab.indexOn,
    isOwner: state.user.isOwner,
    employee: state.detail.user,
    role: state.user.role,
    discounts: state.detail.discounts,
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(ProfileScreen);
