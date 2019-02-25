import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, RefreshControl, Dimensions, Alert, LayoutAnimation, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
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
import CreateUserNoteForm from './CreateUserNoteForm';
import ImageScreen from './ImageScreen';
import EmployeeFormAddLocationEdit from './edit/EmployeeFormAddLocationEdit';

import { uploadImage } from '../api/image-handler';

import * as Parser from '../api/data-builder';
import * as DetailActions from '../action-types/detail-action-types';
import * as Colors from '../constants/colors';
import * as EmployeeActions from '../action-types/employee-profile-action-types';

import * as util from '../util';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const FRAME = Dimensions.get('window');

// TODO make phone number not in touch zone

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  constructor() {
    super();

    this.uploadImage = uploadImage.bind(this);
  }

  state = {
    editPlacesPresented: false,
    editModalPresented: false,
    discountModalPresented: false,
    userPermissionModalPresented: false,
    noteFormPresented: false,
    imagePresented: false,
    selectedDiscount: null,
    isRefreshing: false,
    userPermissionModel: {},
    cameraPermission: false,
    dispatchFromPlace: false,
    newImageURI: null,
    cameraType: Camera.Constants.Type.back,
    animation: (FRAME.height/2) - 100 //(FRAME.height / 2 + 32)
  }

  static propTypes = {
    dismiss: PropTypes.func,
    isMyProfile: PropTypes.bool,
    dispatchFromPlace: PropTypes.bool
  }

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
    isMyProfile: false,
    dispatchFromPlace: false
  }

  componentDidMount () {
    this.getPlaces();
    this.setState({ dispatchFromPlace: this.props.navigation.getParam('dispatchFromPlace', 'dispatchFromPlace') });
  }

  componentWillUnmount() {
    // goBack() sets dispatchFromPlace to false prematurely, so put dispatchFromPlace
    // on the state when props are ready, then just dont touch dispatchFromPlace on state
    if(this.state.dispatchFromPlace) {
      this.props.dispatch({ type: EmployeeActions.RESET });
    } else {
      this.props.dispatch({ type: DetailActions.CLEAR });
    }
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

  // IDEA might change this to if owner or manager, you can see all discounts,
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
      }
    })
  }

  getNotes() {
    API.getUserNotes(this.props.me._id, this.props.employee._id, (err, notes) => {
      if(err) {
        console.log(err);
        this.setState({ isRefreshing: false });
      } else {
        this.props.dispatch({ type: DetailActions.SET_NOTES, notes: notes });
        this.setState({ isRefreshing: false });
      }
    })
  }

  updateImage() {
    var img = new FormData();
    img.append('file', {
      uri: this.state.newImageURI,
      type: 'image/png',
      name: 'testpic'
    });
    this.uploadImage(img, (e1, newImage) => {
      if(e1) {
        console.log(e1);
      } else {
        const data = {
          'userID': this.props.employee._id,
          'imageURL': newImage
        }
        API.updateUserImage(data, (e2, user) => {
          if(e2) {
            console.log(e2);
          } else {
            console.log(user);

            this.props.dispatch({ type: DetailActions.SET_USER, user: user });
          }
        })
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
      this.props.navigation.goBack();
      this.props.dispatch({ type: EmployeeActions.RESET });
    }
  }

  _updateUserPermissions = (role, location, positions) => {
    var data = {
      'relationID': location.relation._id,
      'role': role,
      'positions': positions
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
    if(this.state.canEdit) {
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
    let myPlaces = this.props.myLocations;
    let presentedPlace = myPlaces.find(d => d._id === model._id);

    try {
      if(presentedPlace.relation.role === 1 || presentedPlace.relation.role === 2) {
        this.setState({ userPermissionModalPresented: true, userPermissionModel: model });
      } else {
        Alert.alert('You do not have permission to edit this user!');
      }
    } catch(e) {
      Alert.alert('You do not have permission to edit this user!');
    }
  }

  _presentEditPlaces() {
    this.setState({ editPlacesPresented: true });
  }

  editPlacesButton() {
    if(this.props.indexOn === 1 && this.state.canEdit) {
      return(
        <View style={styles.editPlacesButton} >
          <RoundButton onPress={() => this._presentEditPlaces()} imagePath={require('../../assets/icons/pencil.png')} />
        </View>
      )
    }
  }

  addNoteButton() {
    if(this.props.indexOn === 3) {
      return (
        <View style={styles.addNote} >
          <RoundButton onPress={() => this._presentNoteForm()} imagePath={require('../../assets/icons/plus.png')} />
        </View>
      )
    } else {
      return null;
    }
  }

  profilePicButton() {
    if(!this.props.employee.image_url) {
      return (
        <View style={styles.cameraButton} >
          <RoundButton imagePath={require('../../assets/icons/camera.png')} onPress={() => this.getCameraPermission()} />
        </View>
      )
    }
  }

  fireEmployee(model) {
    var sender = {
      'relationID': model.relation._id
    }
    API.deleteRelation(sender, (err, result) => {
      if(err) {
        console.log(err)
      } else {
        console.log(result);
        this.refreshUser();
      }
    })
  }

  _handleProfileTab(path) {
    var animationProps = {
      type: 'spring',
      springDamping: 0.8,
      property: 'opacity'
    }

    var animationConfig = {
      duration: 500,
      create: animationProps,
      update: animationProps
    }
    LayoutAnimation.configureNext(animationConfig);

    // going to profile and not on profile already
    if(path === EmployeeActions.OPEN_PROFILE_INFO && this.props.indexOn !== 0) {
      this.setState({ animation: (FRAME.height/2) - 100 });
    } else if(path === EmployeeActions.OPEN_PROFILE_INFO && this.props.indexOn === 0) {
      // on profile
      return;
    } else if(path !== EmployeeActions.OPEN_PROFILE_INFO) {
      // totally different path
      this.setState({ animation: 0 });
    }
  }

  getCameraPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ cameraPermission: status === 'granted' });
  }

  takePicture = async() => {
    if(this.camera) {
      await this.camera.takePictureAsync()
        .then((data) => {
          console.log(data);
          this.setState({ newImageURI: data.uri, cameraPermission: false }, () => {
            this.updateImage();
          })
        })
        .catch(e => {
          console.log(e);
          this.setState({ cameraPermission: false });
        })
    }
  }

  render() {
    if(!this.props.employee) {
      return(
        <View></View>
      )
    }

    let initial = FRAME.height / 2;
    let animatedFlex = 1;


    return (
        <View style={{flex:1}} >

          <View style={styles.profilePicContainer} >
            {/*<TouchableOpacity style={{flex:1}} onPress={() => this.setState({ imagePresented: true })}>*/}

              {(this.props.employee.image_url)
                ? <Image style={styles.profilePic} source={{ uri: this.props.employee.image_url }} />
                : <View style={styles.profilePicEmpty}>
                    <Text style={{fontSize:32,fontFamily:'roboto-bold',textAlign:'center', color:'gray'}}></Text>
                  </View>
              }

              <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.2)',zIndex:1000}}></View>

              <View style={styles.backButton}>
                <RoundButton onPress={() => this._goBack()} />
              </View>

              {this.editProfileButton()}
              {this.profilePicButton()}

            {/*</TouchableOpacity>*/}
          </View>

          <View style={styles.bottomContainer}>
            <Animated.View style={[styles.bottomContainerAnimated, { marginTop: this.state.animation }]}>
              <View style={styles.infoContainer0} >
                <Text style={styles.infoTextName} numberOfLines={2} ellipsizeMode={'tail'}>
                  {this.props.employee.first_name} {this.props.employee.last_name}
                </Text>
                <Text style={styles.infoText}>{this.props.employee.email}</Text>
                <TouchableOpacity onPress={() => util.callPhoneNumber(this.props.employee.phone)}>
                  <Text style={styles.infoText}>{util.toPhoneNumber(this.props.employee.phone)}</Text>
                </TouchableOpacity>
                {this.editPlacesButton()}
                {this.addNoteButton()}
              </View>
            <View style={{height: 64, paddingBottom: 8}} >
              <EmployeeTabBar handleProfile={(callback) => this._handleProfileTab(callback)} />
            </View>

            <ScrollView
              style={{display:'float',backgroundColor:'transparent'}}
              refreshControl={ <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshUser} /> }
            >

              <View style={styles.screenContainer} >
              {/*this.addNoteButton()*/}
              {/*this.editPlacesButton()*/}
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
            </ScrollView>
          </Animated.View>
        </View>

        {/*
          <Modal animationType={'slide'} transparent={false} visible={this.state.imagePresented} styles={{marginTop: 0}} >
            <ImageScreen image={this.props.employee.image_url} dismiss={() => this.setState({ imagePresented: false })} />
          </Modal>
          */}

          <Modal animationType={'slide'} transparent={false} visible={this.state.editModalPresented} styles={{marginTop: 0}} onDismiss={() => this.refreshUser()}>
            <EmployeeFormEdit dismiss={this._dismissFormModal} />
          </Modal>

          <Modal animationType={'slide'} transparent={false} visible={this.state.noteFormPresented} >
            <CreateUserNoteForm dismiss={() => this._dismissNoteForm()} />
          </Modal>

          <Modal animationType={'slide'} transparent={false} visible={this.state.discountModalPresented} style={styles.discountModal} onDismiss={() => this.refreshUser()}>
            <DiscountModal dismiss={() => this._dismissDiscountModal()} discount={this.state.selectedDiscount} />
          </Modal>

          <Modal animationType={'slide'} transparent={false} visible={this.state.userPermissionModalPresented} onDismiss={() => this.refreshUser()}>
            <UserPermissionModal
              updatePermission={(role, location, positions) => this._updateUserPermissions(role, location, positions)}
              location={this.state.userPermissionModel}
              onFire={() => this.fireEmployee(this.state.userPermissionModel)}
              dismiss={() => this.setState({ userPermissionModalPresented: false })}
            />
          </Modal>

          {
          <Modal animationType={'slide'} transparent={false} visible={this.state.editPlacesPresented} >
            <EmployeeFormAddLocationEdit
              dismiss={() => this.setState({ editPlacesPresented: false }, () => this.refreshUser() )}
              addLocation={(places) => this.updatePlaces(places)}
            />
          </Modal>
          }

          {(this.state.cameraPermission)
            ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0, zIndex:11000}}>
                <Camera ref={ref => { this.camera = ref; }} type={this.state.cameraType} style={{flex: 1, justifyContent:'flex-end', alignItems:'stretch'}} >
                  <View style={{height: 64, marginBottom:32, flexDirection: 'row', backgroundColor:'transparent', justifyContent:'space-around'}}>
                    <TouchableOpacity onPress={() => this.setState({cameraPermission:false})} style={{height:64,width:128, borderRadius:16, backgroundColor:Colors.BLUE, justifyContent:'center',alignItems:'center'}} >
                      <Image style={{height:32, width:32,tintColor:'white'}} source={require('../../assets/icons/cancel.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture} style={{height:64,width:128,borderRadius:16, backgroundColor:Colors.BLUE,justifyContent:'center',alignItems:'center' }} >
                      <Image style={{height:32, width:32, tintColor:'white'}} source={require('../../assets/icons/camera.png')} />
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>
            : null
          }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomContainerAnimated: {
    flex: 1, backgroundColor: Colors.BACKGROUND_GREY
  },
  bottomContainer: {
    position: 'absolute',
    top: FRAME.height/2, bottom:0, right:0, left:0,
    backgroundColor: 'transparent',
    zIndex: 10050
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
  infoContainer0: {
    position: 'absolute',
    left: 16, right: 16, top: -190
  },
  infoContainer00: {
    position: 'absolute', backgroundColor: 'orange',
    left: 16, right: 16, top: -150,
    // bottom: 100,
    zIndex: 1001
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
  editPlacesButton: {
    position: 'absolute',
    right: 0, bottom: 16, zIndex: 10001
    // right: 16, top: 16, zIndex: 10001
  },
  profilePicContainer: {
    // height: FRAME.height / 2 + 32, backgroundColor:'yellow'
    flex: 1, zIndex: 2
  },
  profilePic: {
    flex: 1, zIndex: 4,
    // height: FRAME.height / 2 + 32, width: FRAME.width,
    resizeMode: 'cover'
  },
  profilePicEmpty: {
    flex: 1, zIndex: 4,
    height: FRAME.height / 2 + 32, width: FRAME.width,   // height was FRAME.height / 8 * 5
    fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
  },
  backButton: {
    position: 'absolute', left: 20, top: 40,
    zIndex: 1001
  },
  optionsButton: {
    position: 'absolute', right: 20, top: 40,
    zIndex: 1001
  },
  cameraButton: {
    position: 'absolute', right: 20, top: 124, zIndex: 1001
  },
  addNote: {
    position: 'absolute',
    right: 0, bottom: 16,
    // right: 16, top: 8,
    zIndex: 1000
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
  // navigation with redux can mess up routes if they goback() or something,
  // so putting these checks in here so it doesnt break
  let dispatchFromPlace = false;

  if(state.nav.routes[state.nav.routes.length-1].params != undefined) {
    dispatchFromPlace = state.nav.routes[state.nav.routes.length-1].params.dispatchFromPlace;
  }

  return {
    indexOn: state.employeeTab.indexOn,
    me: state.user.user,
    employee: state.detail.user,
    myLocations: state.user.myLocations,
    locations: state.detail.locations,
    dispatchFromPlace: dispatchFromPlace
  }
}

export default connect(mapStateToProps)(ProfileScreen);
