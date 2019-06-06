import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, DatePickerIOS, TouchableOpacity,
  ActivityIndicator, StyleSheet, Modal, TextInput, StatusBar,
  Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { checkEmail } from '../util';

import EmployeeFormAddLocation from './EmployeeFormAddLocation';
import OptionView from '../ui-elements/option-view';

import * as Colors from '../constants/colors';
import * as LoadingActions from '../action-types/loading-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as ErrorManager from '../util/error-manager';

import SubmitButton from '../ui-elements/submit-button';
import DataButton from '../ui-elements/data-button';
import RoundButton from '../ui-elements/round-button';
import LoadingOverlay from '../ui-elements/loading-overlay';

import { TextInputMask } from 'react-native-masked-text'


class EmployeeForm extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.checkEmail = checkEmail.bind(this);
    this.inputs = [];

    this.state = {
      addLocationsPresented: false,
      genderOptions: [
        { value: 'Male', selected: false, index: 0},
        { value: 'Female', selected: false, index: 1},
        { value: 'Other', selected: false, index: 2}
      ],
      hairOptions: [
        { value: 'Brown', selected: false, index: 0},
        { value: 'Red', selected: false, index: 1},
        { value: 'Black', selected: false, index: 2},
        { value: 'Grey', selected: false, index: 3},
        { value: 'Blonde', selected: false, index: 4},
        { value: 'Other', selected: false, index: 5}
      ],
      roleOptions: [
        { value: 'No', selected: true, index: 0 },
        { value: 'Yes', selected: false, index: 1 },
      ],
      employee: {
        firstName: "",
        lastName: "",
        position: "",
        phone: "",
        email: "",
        groupID: "",
        role: 0,
        canCreatePlaces: false,
        gender: 0,
        hairColor: 0,
        birthday: new Date(1997, 8, 3).toDateString(),
        hireDate: new Date().toDateString(),
        imageURI: null
      },
      selectedPlaces: [],
      formIncomplete: false,
      cameraPermission: false,
      cameraType: Camera.Constants.Type.back,
      errorMessage: ''
    };
  }

  static propTypes = {
    // dismiss: PropTypes.func,
    submitForm: PropTypes.func,
    places: PropTypes.array,
    edit: PropTypes.bool,
    isOwner: PropTypes.bool
  }
  static defaultPropTypes = {
    edit: false
  }

  componentDidMount() {
    this.genderSelected(this.state.employee.gender);
    this.hairSelected(this.state.employee.hairColor);
  }

  submit = () => {
    this.checkForm((complete) => {
      if(complete) {
        this.props.dispatch({ type: LoadingActions.START_LOADING });
        this.setState({ formIncomplete: false, employee: { ...this.state.employee, groupID: this.props.me.group_id }}, () => {
          this.submitForm();
          // this.props.submitForm(this.state.employee, this.state.selectedPlaces);
          // this.props.dismiss();
        });
      }
    })
  }

  checkForm(callback) {
    if(this.state.selectedPlaces.length < 1) {
      this.setState({ formIncomplete: true, errorMessage: 'You Need to Add Restaurants!'}, () => {
        Alert.alert(this.state.errorMessage);
        callback(false);
      });
    } else {
      if(this.state.employee.firstName.length == 0 || this.state.employee.lastName.length == 0) {
        this.setState({ formIncomplete: true, errorMessage: 'Fields Incomplete' }, () => {
          Alert.alert(this.state.errorMessage);
          callback(false);
        });
      } else {
        this.checkEmail(this.state.employee.email, (complete) => {
          if(complete) {
            this.cleanPhone(() => {
              callback(true);
            });
          } else {
            this.setState({ formIncomplete: true, errorMessage: 'Must be Valid Email' }, () => {
              Alert.alert(this.state.errorMessage);
              callback(false);
            });
          }
        })
      }
    }
  }

  genderSelected = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr, employee: {...this.state.employee, gender: index } });
    });
  }

  hairSelected = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr, employee: {...this.state.employee, hairColor: index } });
    });
  }

  roleSelected = (index) => {
    OptionView.selected(this.state.roleOptions, index, (arr) => {
      this.setState({
        roleOptions: arr,
        employee: {
          ...this.state.employee,
          role: index,
          canCreatePlaces: (index == true)
        }
      });
    });
  }

  cleanPhone = (callback) => {
    let num = this.state.employee.phone;
    for(let i = 0; i < 4; i++) {
      num = num.replace('(', '');
      num = num.replace(')', '');
      num = num.replace('.', '');
      num = num.replace('-', '');
      num = num.replace(' ', '');
    }
    this.setState({ employee: { ...this.state.employee, phone: num }}, () => {
      callback();
    });
  }

  submitForm() {

    let data = {
      // ...data,
      ...this.state.employee,
      "imageURL": this.state.employee.imageURI,
      "sessionID": this.props.sessionID,
      "userID": this.props.me._id
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
        } else {
          data.imageURL = newImage;
          this.submitHelper(data);
        }
      })
    }
  }

  // creates employee then creates relations based off employee _id
  submitHelper = (employee) => {
    DataBuilder.buildEmployeeForm(employee, (obj) => {
      API.createUser(obj, (e1, emp) => {
        if(e1) {
          this.props.dispatch({ type: LoadingActions.STOP_LOADING });

          ErrorManager.handleCreateError(e1.response.status, (message) => {
            Alert.alert(message);
          })
        } else {
          // these are looped, instead of passing the array to the server, because they need one employee to attach to,
          // so its ok if some of them fail just not all
          let relationsCreatedCount = 0;
          for(let i = 0; i < this.state.selectedPlaces.length; i++) {
            let relation = { 'userID': emp.user_id, 'placeID': this.state.selectedPlaces[i].place_id, 'role': this.state.selectedPlaces[i].role, 'positions': this.state.selectedPlaces[i].positions }
            console.log(relation)
            API.createRelation(relation, (e2, relation) => {
              if(e2) {
                console.log(e2);
              } else {
                if(++relationsCreatedCount === this.state.selectedPlaces.length) {
                  this.setState({ employeeFormPresented: false });
                  Alert.alert('Success!');

                  this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: true });
                  this.props.navigation.goBack();

                  // COMBAK still need to run HomeScreen.getPlaces()
                  // this.props.navigation.onBack();
                  this.props.navigation.getParam('onBack', 'onBack')();
                }
              }
            })
          }
        }
      });
    });
  }

  textInputFactory(placeholder, onTextChange, value, canEdit, capitalize = true, keyboard = 'default', inputIndex) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={(capitalize ? 'words' : 'none')}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
        editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
        ref={ref => this.inputs.push(ref)}
        onSubmitEditing={() => this.nextInput(inputIndex)}
      />
    )
  }

  phoneFactory(placeholder) {
    return(
      <TextInputMask
        placeholder={placeholder}
        style={styles.input}
        type={'custom'}
        keyboardType={'phone-pad'}
        returnKeyType={'done'}
        options={{
          mask: '(999) 999-9999'
        }}
        value={this.state.employee.phone}
        onChangeText={text => {
          this.setState({
            employee: { ...this.state.employee, phone: text }
          })
        }}
      />
    )
  }

  nextInput = (index) => {
    if(index === 2) {
      return;
    }

    if(index !== 3) {
      this.inputs[index + 1].focus();
    }
  }

  getCameraPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ cameraPermission: status === 'granted' });
  }

  takePicture = async() => {
    if(this.camera) {
      await this.camera.takePictureAsync({ quality: 0.5 })
        .then((data) => { this.setState({ employee: { ...this.state.employee, imageURI: data.uri }, cameraPermission: false }) })
        .catch(e => {
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

  setCameraRef(ref) {
    this.camera = ref;
  }

  render() {
    return(
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <View style={styles.backButton} >
          {(!this.state.cameraPermission)
            ? <RoundButton onPress={() => this.props.navigation.goBack()} imagePath={require('../../assets/icons/back.png')} />
            : null
          }
        </View>
      <ScrollView style={styles.scrollContainer} >
        <KeyboardAwareScrollView style={styles.container} >

          <View style={{height: 124 }} />

          <Modal animationType={'slide'} transparent={false} visible={this.state.addLocationsPresented} >
            <EmployeeFormAddLocation
              dismiss={() => this.setState({ addLocationsPresented: false }) }
              addLocations={(places) => this.setState({ selectedPlaces: places, formIncomplete: false }) }
            />
          </Modal>

          <Text style={styles.textHeader} >First Name</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('First Name', (text) => this.setState({ employee: {...this.state.employee, firstName: text},formIncomplete:false}), this.state.employee.firstName, true, undefined, undefined, 0)}
          </View>

          <Text style={styles.textHeader} >Last Name</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Last Name', (text) => this.setState({ employee: {...this.state.employee, lastName: text},formIncomplete:false}), this.state.employee.lastName, true, undefined, undefined, 1)}
          </View>

          <Text style={styles.textHeader} >Email</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Email', (text) => this.setState({ employee: {...this.state.employee, email: text},formIncomplete:false}), this.state.employee.email, true, false, 'email-address', 2)}
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.phoneFactory('(555) 555-5555')}
          </View>

          <Text style={styles.textHeader}>Gender</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.genderOptions} selectOption={(index) => this.genderSelected(index)} />
          </View>

          <Text style={styles.textHeader}>Hair Color</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.hairOptions} selectOption={(index) => this.hairSelected(index)} />
          </View>

          {/*
          <Text style={styles.textHeader}>Can create restaurants?</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.roleOptions} selectOption={(index) => this.roleSelected(index)} />
          </View>
          */}

          <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
            {(this.state.employee.imageURI == null)
              ? <Image source={require('../../assets/icons/camera.png')} resizeMode={'cover'} style={styles.imageEmpty} />
              : <Image source={{uri:this.state.employee.imageURI}} style={styles.image} />
            }
          </TouchableOpacity>
          <Text style={styles.imageText}>Upload Employee Image</Text>


            <Text style={styles.textHeader} >Birthday</Text>
            <View style={[styles.dateView, { marginBottom: 32 }]} >
              <DatePickerIOS
                onDateChange={(date) => { this.setState({ employee: {...this.state.employee, birthday: date.toDateString() }}) }}
                date={new Date(this.state.employee.birthday)}
                mode={'date'} maximumDate={new Date()}
              />
            </View>

            <Text style={styles.textHeader} >Hire Date</Text>
            <View style={styles.dateView} >
              <DatePickerIOS
                onDateChange={(date) => { this.setState({ employee: {...this.state.employee, hireDate: date.toDateString() }}) }}
                date={new Date(this.state.employee.hireDate)}
                mode={'date'} maximumDate={new Date()}
              />
            </View>


          <View style={styles.submitContainer} >
            <DataButton title={'ADD RESTAURANTS'} onPress={() => this.setState({addLocationsPresented:true})} data={this.state.selectedPlaces.length} />
          </View>
          <View style={styles.submitContainer} >
            <SubmitButton
              title={this.state.formIncomplete ? this.state.errorMessage : 'ADD EMPLOYEE'}
              onPress={() => this.submit()}
              hasBGColor={true}
              bgColor={this.state.formIncomplete ? 'red' : Colors.BLUE}
            />
          </View>

          <View style={{height: 64}}/>
        </KeyboardAwareScrollView>
        {(this.props.isLoading)
          ? <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end',alignItems:'center'}}><View style={{marginBottom: 140,justifyContent:'flex-start',alignItems:'center'}}><ActivityIndicator size={'large'} color={'white'} /></View></View>
          : null
        }
      </ScrollView>
      {(this.state.cameraPermission)
        ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
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
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16
  },
  backButton: {
    position: 'absolute', left:16,top: 16, zIndex: 100000
  },
  submitContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 16
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageEmpty: {
    width: 84, height: 84,
    // borderRadius: 70,
    tintColor: Colors.BLUE
  },
  image: {
    width: 140, height: 140,
    borderRadius: 70
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
  dateView: {
    marginLeft: 8, marginRight: 8, marginBottom: 16,
    flex: 1, borderRadius: 8,
    backgroundColor: 'white'
  },
  birthdayView: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 32, marginRight: 8, marginLeft: 8,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  birthdayInput: {
    marginLeft: 16, marginRight: 16,
    fontSize: 18,
    color: 'black'
  },
  textHeader: {
    fontSize: 16, marginLeft: 8, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    isOwner: state.user.isOwner,
    places: state.user.myLocations,
    isLoading: state.loading.isLoading,
    me: state.user.user,
    onBack: state.nav.onBack
  }
}

export default connect(mapStateToProps)(EmployeeForm);
