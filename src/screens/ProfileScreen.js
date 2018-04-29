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
import CreateNoteForm from './CreateNoteForm';

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
    noteFormPresented: false,
    selectedDiscount: null,
    isRefreshing: false,
    userPermissionModel: {},
    canEditProfile: false
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
            this.setState({ isRefreshing: false });
            Parser.assignRelationsToPlaces(relations, places, (placesWithRelations) => {
              this.props.dispatch({ type: DetailActions.SET_LOCATIONS, locations: placesWithRelations });
              Parser.checkPermissionForEmployeeEdit(this.props.myLocations, this.props.locations, (role) => {
                this.setState({ canEdit: (role >= 1) ? true : false }, () => {
                  // check this out, might redo role assignment
                  if(!this.state.canEdit) {
                    if(this.props.employee._id === this.props.me._id && this.props.me.can_create_places) {
                      this.setState({ canEdit: true });
                    }
                  }
                });
                this.getDiscounts();
              });
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
        Parser.assignRolesToDiscounts(this.props.locations, discounts, (discountsWithRoles) => {
          // compares employee discounts with my locations and assigns
          // permission accordingly
          Parser.sortDiscountPermissions(discountsWithRoles, this.props.myLocations, (validDiscounts) => {
            this.props.dispatch({ type: DetailActions.SET_DISCOUNTS, discounts: validDiscounts });
            this.getNotes();
          })
        });
        // this.setState({ isRefreshing: false });
      }
    })
  }

  getNotes() {
    API.getUserNotes(this.props.me._id, this.props.employee._id, (err, notes) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        console.log(notes);

        this.props.dispatch({ type: DetailActions.SET_NOTES, notes: notes });
        this.setState({ isRefreshing: false });
      }
    })
  }

  _dismissFormModal = () => {
    this.setState({editModalPresented: false});
  }

  _presentFormModal = () => {
    this.setState({editModalPresented: true});
  }

  _presentNoteForm = () => {
    this.setState({ noteFormPresented: true });
  }

  _dismissNoteForm = () => {
    this.setState({ noteFormPresented: false });
  }

  _selectNote = (note) => {
    this.setState({ selectedNote: note }, () => {
      this.setState({ noteFormPresented})
    })
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

  _updateUserPermissions = (role, location, position) => {
    var data = {
      'relationID': location.relation._id,
      'role': role,
      'position': position
    }
    API.updateRole(data, (err, rel) => {
      if(err) {
        console.log(err, 'coulnt update role');
      } else {
        console.log(rel);
      }
    })
  }

  editProfileButton() {
    // FIXME fix THIS

    // Parser.checkPermissionForEmployeeEdit(this.props.myLocations, this.props.locations, (role) => {
      // if( === 1 || role === 2) {
      if(this.state.canEdit) {
        return (
          <View style={styles.optionsButton}>
            <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
          </View>
        )
      } else {
        return null;
      }
    // });
  }

  _presentUserPermissionModal = (model) => {
    let myPlaces = this.props.myLocations;
    let presentedPlace = myPlaces.find(d => d._id === model._id);

    if(presentedPlace.relation.role === 1 || presentedPlace.relation.role === 2) {
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
                <Text style={styles.infoText}>{this.props.employee.email}</Text>
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
                    ? <NotesTab presentForm={() => this._presentNoteForm()} />
                  : null
            }

            </View>

            <Modal animationType={'slide'} transparent={false} visible={this.state.editModalPresented} styles={{marginTop: 0}} onDismiss={() => this.refreshUser()}>
              <EmployeeFormEdit dismiss={this._dismissFormModal} />
            </Modal>

            <Modal animationType={'slide'} transparent={false} visible={this.state.noteFormPresented} >
              <CreateNoteForm dismiss={() => this._dismissNoteForm()} />
            </Modal>

            <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} style={styles.discountModal} onDismiss={() => this.refreshUser()}>
              <DiscountModal dismiss={() => this._dismissDiscountModal()} discount={this.state.selectedDiscount} />
            </Modal>

            <Modal animationType={'slide'} transparent={false} visible={this.state.userPermissionModalPresented} onDismiss={() => this.refreshUser()}>
              <UserPermissionModal updatePermission={(role, location, position) => this._updateUserPermissions(role, location, position)} location={this.state.userPermissionModel} dismiss={() => this.setState({ userPermissionModalPresented: false })} />
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
    fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
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
    me: state.user.user,
    employee: state.detail.user,
    myLocations: state.user.myLocations,
    locations: state.detail.locations
  }
}

export default connect(mapStateToProps)(ProfileScreen);
