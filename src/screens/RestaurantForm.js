import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Image, Modal, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera, Permissions } from 'expo';
import { connect } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';

import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';

import * as Colors from '../constants/colors';
import * as LoadingActions from '../action-types/loading-action-types';
import * as DataBuilder from '../api/data-builder';
import * as API from '../api/api';

import RestaurantFormAddEmployee from './RestaurantFormAddEmployee';
import SubmitButton from '../ui-elements/submit-button';
import DataButton from '../ui-elements/data-button';
import RoundButton from '../ui-elements/round-button';
import { checkEmail, cleanPhoneNumber } from '../util';

class RestaurantForm extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.checkEmail = checkEmail.bind(this);
    this.cleanPhoneNumber = cleanPhoneNumber.bind(this);
    this.inputs = [];

    this.state = {
      place: {
        name: "",
        address: "",
        email: "",
        phone: "",
        employees: [],
        positions: [],
        // imageURI: ''
      },
      employees: [],
      positionOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Support', selected: false, index: 3 },
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

  submit = () => {
    this.state.positionOptions.forEach(p => {
      if(p.selected) {
        this.state.place.positions.push(p.value);
      }
    });
    if(this.isFormComplete()) {
      this.props.dispatch({ type: LoadingActions.START_LOADING });
      this.submitForm();
    } else {
      Alert.alert('You need to fill out all the fields!')
    }
    // this.checkEmail(this.state.place.email, (complete) => {
      // if(complete) {
        // this.props.dispatch({ type: LoadingActions.START_LOADING });
        // this.submitForm();
        // this.props.dismiss();
      // } else {
        // this.setState({ incomplete: true });
      // }
    // })
  }

  isFormComplete() {
    let place = this.state.place;
    if(place.name.length == 0 || place.address.length == 0
      || place.email.length == 0 || place.phone.length == 0
      || this.state.employees.length == 0 || place.positions.length == 0
    ) {
      return false;
    }
    return true;
  }

  submitForm() {
    this.cleanPhoneNumber(this.state.place.phone, (phone) => {
      this.state.place.phone = phone;
      let data = {
        // ...data,
        ...this.state.place,
        // "imageURL": this.state.place.imageURI,
        "sessionID": this.props.sessionID,
        "userID": this.props.me._id,
        "groupID": this.props.me.group_id
      }

      this.submitHelper(data);
    })
  }

  submitHelper = (data) => {
    DataBuilder.buildPlaceForm(data, (obj) => {
      API.createPlace(obj, (e1, place) => {
        if(e1) {
          Alert.alert(e1.message);
          this.props.dispatch({ type: LoadingActions.STOP_LOADING });
        } else {
          console.log(place);

          this.state.employees.forEach((e) => {
            e.placeID = place._id;
          });

          const relationData = {
            'placeID': place._id,
            'userID': this.props.me._id,
            'role': 2,
            'positions': []
          }
          API.createRelation(relationData, (e2, relation) => {
            if(e2) {
              console.log(e2);
              this.props.dispatch({ type: LoadingActions.STOP_LOADING });
            } else {

              if(this.state.employees.length > 0) {
                let sender = {
                  'relations': this.state.employees
                }
                API.createRelations(sender, (e3, empRelations) => {
                  if(e3) {
                    console.log(e3);
                  } else {
                    console.log(empRelations);
                  }
                })
              }
              // create relations for all the employees
              this.props.dispatch({ type: LoadingActions.STOP_LOADING, needReload: true });
              this.props.navigation.goBack();
              this.props.navigation.getParam('onBack', 'onBack')();
              // debugger
              // onBack();
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

  handleAddEmployees = () => {
    let positions = [];
    for(let i = 0; i < this.state.positionOptions.length; i++) {
      if(this.state.positionOptions[i].selected) {
        positions.push(this.state.positionOptions[i].value);
      }
    }

    if(positions.length === 0) {
      Alert.alert('You need to select positions first!');
    } else {
      this.setState({ selectedPositions: positions, addEmployeeFormPresented: true });
    }

  }

  textInputFactory(placeholder, onTextChange, value, capitalize = true, keyboard = 'default', inputIndex) {
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE}
        style={styles.input} keyboardType={keyboard} returnKeyType={'done'}
        autoCorrect={false} autoCapitalize={(capitalize) ? 'words' : 'none'}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
        onSubmitEditing={() => this.nextInput(inputIndex)}
        ref={ref => this.inputs.push(ref)}
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
        value={this.state.place.phone}
        onChangeText={text => {
          this.setState({
            place: { ...this.state.place, phone: text }
          })
        }}
      />
    )
  }

  nextInput = (index) => {
    if(index !== 3) {
      this.inputs[index + 1].focus();
    }
  }

  // getCameraPermission = async() => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //
  //   this.setState({ cameraPermission: status === 'granted' });
  // }
  //
  // takePicture = async() => {
  //   if(this.camera) {
  //     await this.camera.takePictureAsync()
  //       .then((data) => { this.setState({ place: { ...this.state.place, imageURI: data.uri }, cameraPermission: false }) })
  //       .catch(e => {
  //         this.setState({ cameraPermission: false });
  //       })
  //   }
  // }

  render() {
    return(
      <View style={{flex: 1}} >
        <StatusBar hidden />
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.navigation.goBack()} imagePath={require('../../assets/icons/back.png')} />
        </View>
      <ScrollView style={styles.scrollContainer} >

        <Modal animationType={'slide'} transparent={false} visible={this.state.addEmployeeFormPresented} >
          <RestaurantFormAddEmployee
            dismissModal={(employees) => this.setState({ addEmployeeFormPresented: false })}
            addEmployees={(employees) => this.setState({ addEmployeeFormPresented: false, employees: employees })}
            positions={this.state.selectedPositions}
          />
        </Modal>


        <KeyboardAwareScrollView style={styles.container} >
          <View style={{height: 124}} />

          <Text style={styles.textHeader} >Restaurant Name</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Name', (text) => this.setState({ place: {...this.state.place, name: text}}), this.state.place.name, undefined, undefined, 0)
            }
          </View>

          <Text style={styles.textHeader} >Address</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Address', (text) => this.setState({ place: {...this.state.place, address: text}}), this.state.place.address, undefined, undefined, 1)
            }
          </View>

          <Text style={styles.textHeader} >Email</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('hello@restaurant.com', (text) => this.setState({ place: {...this.state.place, email: text}, incomplete: false}), this.state.place.email, false, 'email-address', 2)}
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.phoneFactory('(555) 555-5555')}
            {/*this.textInputFactory('555.555.5555', (text) => this.setState({ place: {...this.state.place, phone: text}}), this.state.place.phone, true, 'numeric', 3)*/}
          </View>

          <Text style={styles.textHeader}>Choose Positions</Text>
          <View style={styles.optionContainer} >
            <OptionViewSplit options={this.state.positionOptions} selectOption={(index) => this.positionSelected(index)} />
          </View>

          <TouchableOpacity style={styles.submitContainer} >
            <DataButton
              title={'ADD EMPLOYEES'}
              onPress={() => this.handleAddEmployees()}
              data={this.state.employees.length}
            />
          </TouchableOpacity>

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
    me: state.user.user,
    isLoading: state.loading.isLoading,
    sessionID: state.user.sessionID
  }
}

export default connect(mapStateToProps)(RestaurantForm);
