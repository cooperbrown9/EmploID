import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera, Permissions } from 'expo';
import { connect } from 'react-redux';
import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';

import * as Colors from '../constants/colors';
import * as LoadingActions from '../action-types/loading-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as DataBuilder from '../api/data-builder';
import * as API from '../api/api';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import { checkEmail } from '../util';

class RestaurantForm extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.checkEmail = checkEmail.bind(this);

    this.state = {
      place: {
        name: "Rusty Moose",
        address: "6969 E. Rockford Way",
        email: "hello@restaurant.com",
        phone: "555-555-5555",
        employees: [],
        positions: [],
        imageURI: null
      },
      positionOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Busser', selected: false, index: 3 },
        { value: 'Manager', selected: false, index: 4 },
        { value: 'Chef', selected: false, index: 5 },
        { value: 'Cook', selected: false, index: 6 },
        { value: 'Dishwasher', selected: false, index: 7 }
      ],
      incomplete: false,
      cameraPermission: false,
      cameraType: Camera.Constants.Type.back,
      addEmployeeFormPresented: false
    };
  }

  static propTypes = {
    dismiss: PropTypes.func,
    submitForm: PropTypes.func,
    edit: PropTypes.bool
  }

  static defaultProps = {
    edit: false
  }


  componentWillMount() {
  }

  submit = () => {
    this.state.positionOptions.forEach(p => {
      if(p.selected) {
        this.state.place.positions.push(p.value);
      }
    });

    this.checkEmail(this.state.place.email, (complete) => {
      if(complete) {
        this.props.dispatch({ type: LoadingActions.START_LOADING });
        this.submitForm();
        // this.props.dismiss();
      } else {
        this.setState({ incomplete: true });
      }
    })
  }

  submitForm() {
    let data = {
      // ...data,
      ...this.state.place,
      "imageURL": this.state.place.imageURI,
      "sessionID": this.props.sessionID,
      "userID": this.props.me._id,
      "groupID": this.props.me.group_id
    }

    if(data.imageURI == null) {
      this.submitHelper(data);
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
          this.props.dispatch({ type: LoadingActions.STOP_LOADING });
        } else {
          data.imageURL = newImage;
          this.submitHelper(data);
        }
      })
    }
  }

  submitHelper = (data) => {
    DataBuilder.buildPlaceForm(data, (obj) => {
      API.createPlace(obj, (err, place) => {
        if(err) {
          Alert.alert(err.message);
          this.props.dispatch({ type: LoadingActions.STOP_LOADING });
        } else {
          console.log(place);

          const relationData = {
            'placeID': place._id,
            'userID': this.props.me._id,
            'role': 2
          }
          API.createRelation(relationData, (err, relation) => {
            if(err) {
              console.log(err);
              this.props.dispatch({ type: LoadingActions.STOP_LOADING });
            } else {
              console.log(relation);

              this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: true });
              this.props.dispatch({ type: NavActions.BACK });

              Alert.alert('Success!');

              this.props.onBack();
              // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
              // this.refreshUser(data, () => {
              //   this.getPlaces();
              // });
            }
          });
        }
      });
    });
  }

  positionSelected = (index) => {
    OptionViewSplit.selectedMultiple(this.state.positionOptions, index, (arr) => {
      this.setState({ positionOptions: arr });
    });
  }

  textInputFactory(placeholder, onTextChange, value, capitalize = true, keyboard = 'default') {
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE}
        style={styles.input} keyboardType={keyboard} returnKeyType={'done'}
        autoCorrect={false} autoCapitalize={(capitalize) ? 'words' : 'none'}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
      />
    )
  }

  getCameraPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ cameraPermission: status === 'granted' });
  }

  takePicture = async() => {
    if(this.camera) {
      await this.camera.takePictureAsync()
        .then((data) => { this.setState({ place: { ...this.state.place, imageURI: data.uri }, cameraPermission: false }) })
        .catch(e => {
          this.setState({ cameraPermission: false });
        })
    }
  }

  render() {
    return(
      <View style={{flex: 1}} >
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.dispatch({ type: NavActions.BACK })} imagePath={require('../../assets/icons/back.png')} />
        </View>
      <ScrollView style={styles.scrollContainer} >

        {/*
        <Modal animationType={'slide'} transparent={false} visible={this.state.addEmployeeFormPresented} >
          <LocationFormAddEmployee
            dismissModal={() => this.setState({ addEmployeeFormPresented: false })}
            addEmployees={(employees) => this.setState({ place: { ...this.state.place, employees: employees }})}
          />
        </Modal>
        */}


        <KeyboardAwareScrollView style={styles.container} >
          <View style={{height: 124}} />

          <Text style={styles.textHeader} >Restaurant Name</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Name', (text) => this.setState({ place: {...this.state.place, name: text}}), this.state.place.name)
            }
          </View>

          <Text style={styles.textHeader} >Address</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Address', (text) => this.setState({ place: {...this.state.place, address: text}}), this.state.place.address)
            }
          </View>

          <Text style={styles.textHeader} >Email</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('hello@restaurant.com', (text) => this.setState({ place: {...this.state.place, email: text}, incomplete: false}), this.state.place.email, false, 'email-address')}
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('555.555.5555', (text) => this.setState({ place: {...this.state.place, phone: text}}), this.state.place.phone, true, 'numeric')}
          </View>

          <Text style={styles.textHeader}>Choose Positions</Text>
          <View style={styles.optionContainer} >
            <OptionViewSplit options={this.state.positionOptions} selectOption={(index) => this.positionSelected(index)} />
          </View>

          {/*
          <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
            {(this.state.place.imageURI == null)
              ? <Image source={require('../../assets/icons/camera.png')} resizeMode={'center'} style={styles.imageEmpty} />
            : <Image source={{uri:this.state.place.imageURI}} style={styles.image} />

            }
          </TouchableOpacity>
          <Text style={styles.imageText}>Upload Restaurant Image</Text>

          <View style={styles.submitContainer} >
            <SubmitButton title={'ADD RESTAURANTS'} onPress={() => this.setState({ addEmployeeFormPresented: true }) } />
          </View>
          */}

          <TouchableOpacity style={styles.submitContainer} >
            <SubmitButton
              title={(!this.state.incomplete) ? 'CREATE LOCATION' : 'Must be valid email address'}
              onPress={() => this.submit()}
              hasBGColor={true}
              bgColor={(this.state.incomplete) ? 'red' : Colors.BLUE}
            />
          </TouchableOpacity>

          <View style={{height: 64}}/>
        </KeyboardAwareScrollView>
        {(this.props.isLoading)
          ? <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end',alignItems:'center'}}><View style={{marginBottom: 140,justifyContent:'flex-start',alignItems:'center'}}><ActivityIndicator size={'large'} color={'white'} /></View></View>
          : null
        }
      </ScrollView>
      {(this.state.cameraPermission)
        ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
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
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16
  },
  backButton: {
    position: 'absolute', left:16,top: 40, zIndex: 100000
  },
  submitContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 16
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: 'yellow'
  },
  imageEmpty: {
    width: 140, height: 140,
    borderRadius: 70,
    tintColor: Colors.BLUE
  },
  imageText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16,
    flex: 1,
  },
  input: {
    marginLeft: 16,
    fontSize: 18,
    color: 'black'
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 32, marginRight: 8, marginLeft: 8,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  textHeader: {
    fontSize: 16, marginLeft: 8, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    onBack: state.nav.onBack,
    me: state.user.user,
    isLoading: state.loading.isLoading,
    sessionID: state.user.sessionID
  }
}

export default connect(mapStateToProps)(RestaurantForm);
