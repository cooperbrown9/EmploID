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
    // remove API calls, move all to redux
    // this.getEmployeePlaces();
    this.getPlaces();
  }

  getEmployeePlaces() {
    API.getPlacesFromEmployee(this.props.employee._id, (err, response) => {
      if(err){
        console.log(err);
        debugger
      } else {
        console.log(response);
        // this.setState({places: response});
        this.props.dispatch({ type: EmployeeDetailActions.SET_LOCATIONS, locations: response })
      }
    });
  }

  getPlaces() {
    let placesCount = 0;
    let places = [];

    for(let i = 0; i < this.props.employee.places.length; i++) {
      API.getPlace(this.props.employee.places[i].place_id, (err, response) => {
        if(err) {
          console.log(err);
          debugger;
        } else {
          placesCount++;
          places.push(response);

          if(placesCount === this.props.employee.places.length) {
            this.props.dispatch({ type: EmployeeDetailActions.SET_LOCATIONS, locations: places });
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
            <View style={styles.optionsButton}>
              <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
            </View>

            <View style={styles.infoContainer} >
              <Text style={styles.infoTextName}>{this.props.employee.name}</Text>
              <Text style={styles.infoText}>{this.props.employee.position}</Text>
              <Text style={styles.infoText}>{this.props.employee.phone}</Text>
            </View>
          </View>

          <View style={{height: 64, paddingBottom: 8}}>
            <EmployeeTabBar />
          </View>

          <View style={styles.screenContainer} >

         {(this.props.indexOn === 0)
            ? <ProfileTab  />
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
    employeeID: state.user.userID,
    isOwner: state.user.isOwner,
    employee: state.employeeDetail.employee
  }
}

export default connect(mapStateToProps)(ProfileScreen);
