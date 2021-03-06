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
import CreatePlaceNoteForm from './CreatePlaceNoteForm';
import AddEmployeesToRestaurant from './AddEmployeesToRestaurant';

import * as API from '../api/api';
import * as DetailActions from '../action-types/detail-action-types';
import * as NavActions from '../action-types/nav-action-types';

import * as DataBuilder from '../api/data-builder';
import * as util from '../util';
import * as Colors from '../constants/colors';

class RestaurantProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: true
  }

  state = {
    formModal: false,
    noteFormEdit: false,
    discountModalPresented: false,
    addEmployeesFormPresented: false,
    noteFormPresented: false,
    createDiscountModalPresented: false,
    isRefreshing: false,
    selectedDiscount: null,
    selectedNote: null
  }

  componentDidMount() {
    this.getUsers();
  }

  componentWillUnmount() {
    this.props.dispatch({ type: DetailActions.CLEAR });
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
            // Promise.all([this.cacheImages(users)])
            // .then((data) => {
              // console.log(data)
              DataBuilder.assignRelationsToUsers(relations, users, (usersWithRelations) => {
                // usersWithRelations.splice(usersWithRelations.indexOf((u) => u._id == this.props.me._id), 1)
                this.props.dispatch({ type: DetailActions.SET_EMPLOYEES, employees: usersWithRelations });
                this.getDiscounts();
              })
            // }).catch(e => console.log(e))
          }
        })
      }
    })
  }

  cacheImages(users) {
    return users.map((user) => {
      return Image.prefetch(user.image_url)
    })
  }

  getDiscounts() {
    API.getDiscountsByPlace(this.props.location._id, (e1, discounts) => {
      if(e1) {
        console.log(e1);
        this.setState({ isRefreshing: false });
      } else {

        if(this.props.location.relation.role !== 1 && this.props.location.relation.role !== 2) {
          let legalDiscounts = [];
          discounts.forEach(d => (!d.exclusive) ? legalDiscounts.push(d) : console.log('lmao'));
          discounts = legalDiscounts;
        }
        this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: discounts });
        this.getNotes();
      }
    })
  }

  getNotes() {
    API.getPlaceNotes(this.props.me._id, this.props.location._id, (err, notes) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        this.props.dispatch({ type: DetailActions.SET_NOTES, notes: notes });
        this.setState({ isRefreshing: false });
      }
    })
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
        // this.getDiscounts();
      }
    })
  }

  _hireEmployees = (employees) => {
    const sender = {
      'relations': employees
    }

    API.createRelations(sender, (err, result) => {
      if(err) {
        console.log(err);
        Alert.alert('We encountered an error!');
      } else {
        console.log(result);
        this.refreshLocation();
      }
    });

  }

  // wrapper for getUpdatedLocation so it can setState
  refreshLocation = () => {
    this.setState({ isRefreshing: true}, () => {
      this.getUpdatedLocation();
    })
  }

  _presentNoteForm = () => {
    this.setState({ noteFormPresented: true });
  }
  _dismissNoteForm = (didCreate) => {
    this.setState({ noteFormPresented: false, noteFormEdit: false, isRefreshing: true }, () => {
      this.getUpdatedLocation();
    })
  }

  _presentAddEmployeeForm = () => {
    this.setState({ addEmployeesFormPresented: true });
  }

  _dismissAddEmployeeForm = () => {
    this.setState({ addEmployeesFormPresented: false });
  }

  _presentFormModal() {
    this.setState({ formModal: true });
  }
  _dismissFormModal() {
    this.setState({ formModal: false });
  }

  // make it able to present the discount thing
  _presentDiscountForm() {
    this.setState({ createDiscountModalPresented: true });
  }

  _presentDiscountModal = (discount) => {
    this.setState({ discountModalPresented: true, selectedDiscount: discount });
  }

  _dismissDiscountModal() {
    this.setState({ discountModalPresented: false });
  }

  _dismissDiscountForm = (didCreateDiscount) => {
    if(didCreateDiscount) {
      this.refreshLocation();
    }
    this.setState({ createDiscountModalPresented: false });
  }

  _goBack() {
    this.props.navigation.goBack();
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

  onSelectEmployee(employee) {
    this.props.dispatch({ type: DetailActions.SET_USER, user: employee });
    // this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE, dispatchFromPlace: true });
    this.props.navigation.push(NavActions.EMPLOYEE_PROFILE, { dispatchFromPlace: true });
  }

  onSelectNote = (note) => {
    this.setState({ noteFormEdit: true, noteFormPresented: true, selectedNote: note });
  }

  editProfileButton() {
    if(this.props.myRole === 2) {
      return (
        <View style={styles.optionsButton}>
          <RoundButton onPress={this._presentFormModal.bind(this)} imagePath={require('../../assets/icons/pencil.png')} color={Colors.BLUE}/>
        </View>
      )
    } else {
      return null;
    }
  }

  editPlacesButton() {
    // moving edit places to the web
    // return null;
    if(this.props.indexOn === 0 && this.props.myRole >= 1) {
      return(
        <View style={styles.editPlacesButton} >
          <RoundButton
            onPress={() => this._presentAddEmployeeForm()}
            imagePath={require('../../assets/icons/add.png')}
            color={Colors.BLUE}
          />
        </View>
      )
    }
  }

  addButton() {
    if(this.props.indexOn === 1) {
      // discounts tab
      if(this.props.myRole === 1 || this.props.myRole === 2) {
        return(
          <View style={styles.addDiscount} >
            <RoundButton
              onPress={this._presentDiscountForm.bind(this)}
              imagePath={require('../../assets/icons/add.png')}
              color={Colors.BLUE}
            />
          </View>
        )
      }
    } else if(this.props.indexOn === 2 && this.props.myRole >= 1) {
      return(
        <View style={styles.addDiscount} >
          <RoundButton
            onPress={() => this._presentNoteForm()}
            imagePath={require('../../assets/icons/add.png')}
            color={Colors.BLUE}
          />
        </View>
      )
    } else {
      return null;
    }
  }

  //refreshControl={ <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshLocation} />}
  render() {
    return (
      <View style={{flex:1}} >
        <View style={styles.topContainer} >

          {/*(this.props.location.image_url)
            ? <Image style={styles.profilePic} source={{ uri: this.props.location.image_url }} />
            : <View style={styles.profilePicEmpty}>
                <Text style={{fontSize:32,fontFamily:'roboto-bold',textAlign:'center', color:'gray'}}>No Image</Text>
              </View>
          */}


          <View style={styles.infoContainer} >
            <Text style={styles.infoTextName}>{this.props.location.name}</Text>
            <TouchableOpacity onPress={() => util.callPhoneNumber(this.props.location.phone)}>
              <Text style={styles.infoText}>{util.toPhoneNumber(this.props.location.phone)}</Text>
            </TouchableOpacity>
            <Text style={styles.infoText}>{this.props.location.address}</Text>
            <Text style={styles.infoText}>{this.props.location.email}</Text>
          </View>
          {this.editProfileButton()}
          {this.addButton()}
          {this.editPlacesButton()}
        </View>


          <View style={styles.backButton}>
            <RoundButton onPress={this._goBack.bind(this)} imagePath={require('../../assets/icons/back.png')} color={Colors.BLUE} />
          </View>


          {/*<View style={{height:FRAME.height / 4, backgroundColor:'transparent'}}/>*/}
          <View style={{height: 64, paddingBottom: 8}}>
            <LocationTabBar />
          </View>
          <ScrollView style={{backgroundColor:'transparent', zIndex: 20000}}>

          <View >
       {(this.props.indexOn === 0)
          ? <EmployeesTab onPress={(employee) => this.onSelectEmployee(employee)} />
          : (this.props.indexOn === 1)
            ? <DiscountsTab selectDiscount={(discount) => this._presentDiscountModal(discount)} />
            : (this.props.indexOn === 2)
              ? <NotesTab onSelectNote={(note) => this.onSelectNote(note)} />
              : null
        }

          </View>
        </ScrollView>

        <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} >
          <RestaurantFormEdit updateLocation={(place) => this._updateLocation(place)} dismiss={() => this.setState({ formModal: false }, () => { this.getUpdatedLocation()})} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.createDiscountModalPresented} >
          <CreateDiscountForm dismiss={(didCreate) => this._dismissDiscountForm(didCreate)} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.noteFormPresented} >
          <CreatePlaceNoteForm edit={this.state.noteFormEdit} note={this.state.selectedNote} dismiss={(didCreate) => this._dismissNoteForm(didCreate)} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} >
          <DiscountModal dismiss={this._dismissDiscountModal.bind(this)} discount={this.state.selectedDiscount} myRole={this.props.location.relation.role} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.addEmployeesFormPresented} >
          <AddEmployeesToRestaurant
            dismiss={() => this._dismissAddEmployeeForm()}
            place={this.props.location}
            addEmployees={(employees) => this._hireEmployees(employees)}
          />
        </Modal>

      </View>
    )
  }
}

const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    height: FRAME.height / 2 - 64, backgroundColor: 'rgb(40,40,40)'//Colors.BLUE
  },
  infoText: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 18,
    color: 'white',
    marginBottom: 8
  },
  infoTextName: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 32,
    color: 'white',
    marginTop: 8, marginBottom: 8
  },
  infoContainer0: {
    position: 'absolute',
    left: 16, right: 16, top: -150,
    // bottom: 100,
    zIndex: 1001
  },
  infoContainer: {
    position: 'absolute',
    left: 16, right: 16, bottom: 16,
    zIndex: 1001
  },
  profilePicContainer: {
    flex: 4,
  },
  profilePic: {
    flex: 1, zIndex: 11000,
    height: FRAME.height / 2 - 64,
    width: FRAME.width,
    resizeMode: 'cover'
  },
  // height was FRAME.height / 8 * 5
  profilePicEmpty: {
    flex: 1, zIndex: 11000,
    height: FRAME.height / 2 - 64, width: FRAME.width,
    resizeMode: 'cover',
    fontSize: 32, fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
  },
  backButton: {
    position: 'absolute', left: 20, top: (FRAME.height >= 812) ? 40 : 24,
    zIndex: 1001
  },
  editPlacesButton: {
    position: 'absolute',
    right: 16, bottom: 16, zIndex: 10001
    // right: 16, top: 16, zIndex: 10001
  },
  optionsButton: {
    position: 'absolute', right: 20, top: (FRAME.height >= 812) ? 40 : 24,
    zIndex: 1001
  },
  tabContainer: {
    height: 64
  },
  addDiscount: {
    position: 'absolute',
    right: 16, bottom: 16,
    // right: 16, top: 8,
    zIndex: 10000
  }
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
