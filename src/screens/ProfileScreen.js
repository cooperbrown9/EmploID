import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Modal, RefreshControl, Dimensions, Alert,
  LayoutAnimation, NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { ifIphoneX } from 'react-native-iphone-x-helper'

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
// import ImageScreen from './ImageScreen';
import EmployeeFormAddLocationEdit from './edit/EmployeeFormAddLocationEdit';
// import ProgressiveImage from '../ui-elements/progressive-image';

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

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.uploadImage = uploadImage.bind(this);

    this.state = {
      editPlacesPresented: false,
      noteFormEdit: false,
      editModalPresented: false,
      discountModalPresented: false,
      userPermissionModalPresented: false,
      noteFormPresented: false,
      imagePresented: false,
      selectedDiscount: null,
      dispatchFromPlace: props.navigation.getParam('dispatchFromPlace', false),
      selectedNote: null,
      isRefreshing: false,
      userPermissionModel: {},
      cameraPermission: false,
      dispatchFromPlace: false,
      newImageURI: null,
      cameraType: Camera.Constants.Type.back,
      animation: (FRAME.height/2) - 100 //(FRAME.height / 2 + 32)
    }
  }



  static navigationOptions = {
    header: null,
    gesturesEnabled: false
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
                // COMBAK if weird editing issues, check out how
                // canEdit is assigned again in the setState callback here
                this.setState({ canEdit: (role >= 1) ? true : false }, () => {
                  // check this out, might redo role assignment
                  if(!this.state.canEdit) {
                    // COMBAK remove this...redundant and way better ways to do this
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
    this.setState({ noteFormPresented: false, noteFormEdit: false }, () => {
      this.getNotes()
    });
  }

  _onSelectNote = (note) => {
    this.setState({ selectedNote: note, noteFormPresented: true, noteFormEdit: true })
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
          <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/pencil.png')}/>
        </View>
      )
    } else {
      return null;
    }
  }

  _presentUserPermissionModal = (model) => {
    let myPlaces = this.props.myLocations;
    let presentedPlace = myPlaces.find(d => d._id === model._id);
    // TODO if owner, display owner on employee cell
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
          <RoundButton onPress={() => this._presentNoteForm()} imagePath={require('../../assets/icons/add.png')} />
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
          <RoundButton imagePath={require('../../assets/icons/camera.png')} onPress={() => this.getCameraPermission()} color={Colors.YELLOW} />
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

  switchCameraType = () => {
    if(this.state.cameraType == Camera.Constants.Type.back) {
      this.setState({ cameraType: Camera.Constants.Type.front })
    } else {
      this.setState({ cameraType: Camera.Constants.Type.back })
    }
  }

  render() {
    if(!this.props.employee) {
      return(
        <View></View>
      )
    }

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
              {/*this.editPlacesButton()*/}
              {this.addNoteButton()}
            </View>
          <View style={{height: 64, paddingBottom: 8}} >
            <EmployeeTabBar handleProfile={(callback) => this._handleProfileTab(callback)} />
          </View>

          <ScrollView
            style={{backgroundColor:'transparent'}}
            contentContainerStyle={{alignItems: 'stretch'}}
            refreshControl={ <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshUser} /> }
          >


            {/*<View style={styles.screenContainer} >*/}
            {/*this.addNoteButton()*/}
            {/*this.editPlacesButton()*/}

           {(this.props.indexOn === 0)
              ? <ProfileTab />
              : (this.props.indexOn === 1)
                ? <LocationsTab presentModal={(model) => this._presentUserPermissionModal(model)} />
                : (this.props.indexOn === 2)
                  ? <DiscountsTab selectDiscount={(disc) => this.setState({ selectedDiscount: disc }, () => this._presentDiscountModal())} />
                : (this.props.indexOn === 3)
                    ? <NotesTab onSelectNote={(note) => this._onSelectNote(note)}/>
                  : null
            }

          {/*</View>*/}
          </ScrollView>
        </Animated.View>
      </View>

        <Modal animationType={'slide'} transparent={false} visible={this.state.editModalPresented} styles={{marginTop: 0}} onDismiss={() => this.refreshUser()}>
          <EmployeeFormEdit dismiss={this._dismissFormModal} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.noteFormPresented} >
          <CreateUserNoteForm edit={this.state.noteFormEdit} note={this.state.selectedNote} dismiss={() => this._dismissNoteForm()} />
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
          ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0, zIndex: 100001}}>
              <Camera ref={ref => { this.camera = ref; }} type={this.state.cameraType} style={{flex: 1, justifyContent:'center', alignItems:'center'}} >
                <TouchableOpacity style={{position:'absolute',right:16,top:64}} onPress={this.switchCameraType}>
                  <Image source={require('../../assets/icons/switch.png')} style={{height: 40, width: 40,tintColor:'white'}} resizeMode={'contain'} />
                </TouchableOpacity>
                <Image style={{height: 300, width: 300, zIndex: 10004,tintColor:'white'}} source={require('../../assets/images/circle.png')} resizeMode={'contain'}/>
                <View style={{height: 64, position:'absolute', bottom: 64, left: 16, right: 16, flexDirection: 'row', backgroundColor:'transparent', justifyContent:'space-around'}}>
                  <TouchableOpacity onPress={() => this.setState({cameraPermission:false})} style={{height:64,width:128, borderRadius:16, backgroundColor:Colors.BLUE, justifyContent:'center',alignItems:'center'}} >
                    <Image style={{height:32, width:32, tintColor:'white'}} source={require('../../assets/icons/cancel.png')} />
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
    fontFamily: 'roboto-bold', fontSize: 32,
    color: 'white',
    marginBottom: 8
  },
  infoText: {
    backgroundColor: 'transparent',
    fontFamily: 'roboto-bold', fontSize: 18,
    color: 'white',
    marginBottom: 12
  },
  infoContainer0: {
    position: 'absolute',
    left: 16, right: 16, top: -120
  },
  // infoContainer00: {
  //   position: 'absolute', backgroundColor: 'orange',
  //   left: 16, right: 16, top: -190,
  //   // bottom: 100,
  //   zIndex: 1001
  // },
  infoContainer: {
    position: 'absolute',
    left: 16, right: 16, bottom: 16,
    zIndex: 1001
  },
  animatedTabView: {
    position: 'absolute', left: 0, top: 0, width: FRAME.wdith * 4, bottom: 0,
    backgroundColor: 'yellow'
  },
  screenContainer: {
    flex: 1,
    flexDirection: 'column', backgroundColor: 'orange'
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
    height: undefined, width: undefined,
    // height: FRAME.height / 2 + 32, width: FRAME.width,
    resizeMode: 'cover'
  },
  profilePicEmpty: {
    flex: 1, zIndex: 4,
    height: FRAME.height / 2 + 32, width: FRAME.width,   // height was FRAME.height / 8 * 5
    fontFamily: 'roboto-bold', textAlign: 'center', justifyContent: 'center', alignItems: 'center'
  },
  backButton: {
    position: 'absolute', left: 16, top: 24,
    ...ifIphoneX({
      top: 40
    }),
    zIndex: 1001
  },
  optionsButton: {
    position: 'absolute', right: 16, top: 24,
    ...ifIphoneX({
      top: 40
    }),
    zIndex: 1001
  },
  cameraButton: {
    position: 'absolute', right: 16, top: 100, zIndex: 1001,
    ...ifIphoneX({
      top: 116
    }),
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

  // NOTE removed this when I upgraded navigation tot 3.3.2, so not on redux anymore
  // if(state.nav.routes[state.nav.routes.length-1].params != undefined) {
  //   dispatchFromPlace = state.nav.routes[state.nav.routes.length-1].params.dispatchFromPlace;
  // }

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
