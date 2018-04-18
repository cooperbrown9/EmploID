import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, DatePickerIOS, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TextInput, Image, Alert } from 'react-native';

import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { checkEmail } from '../util';

import EmployeeFormAddLocation from './EmployeeFormAddLocation';
import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';

import * as Colors from '../constants/colors';
import * as LoadingActions from '../action-types/loading-action-types';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import LoadingOverlay from '../ui-elements/loading-overlay';

class EmployeeForm extends Component {
  constructor() {
    super();

    this.checkEmail = checkEmail.bind(this);

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
        password: "",
        position: "",
        phone: "",
        email: "",
        groupID: "",
        role: 0,
        gender: 0,
        hairColor: 0,
        places: [],
        birthday: new Date(1997, 8, 3).toDateString(),
        hireDate: new Date().toDateString(),
        imageURI: null
      },
      selectedPlaces: [],
      placeSelected: false,
      cameraPermission: false,
      formIncomplete: false,
      errorMessage: '',
      cameraType: Camera.Constants.Type.back
    };
  }

  static propTypes = {
    dismiss: PropTypes.func,
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
    // if(this.state.employee.places.length < 1) {
    // if(this.state.selectedPlaces.length < 1) {
    //   Alert.alert('You need to assign the employee to a restaurant!');
    // } else {
    //   this.checkEmail(this.state.employee.email, (complete) => {
    //     if(complete) {
    //       this.cleanPhone(() => {
    //         this.setState({ formIncomplete: false, employee: { ...this.state.employee, groupID: this.props.user.group_id }});
    //         this.props.submitForm(this.state.employee, this.state.selectedPlaces);
    //         this.props.dismiss();
    //       })
    //     } else {
    //       this.setState({ formIncomplete: true });
    //     }
    //   });
    // }
    this.checkForm(() => {
      this.setState({ formIncomplete: false, employee: { ...this.state.employee, groupID: this.props.user.group_id }}, () => {
        this.props.submitForm(this.state.employee, this.state.selectedPlaces);
        this.props.dismiss();
      });
    })
  }

  checkForm(callback) {
    if(this.state.selectedPlaces.length < 1) {
      this.setState({ formIncomplete: true, errorMessage: 'You Need to Add Restaurants!'});
    } else {
      if(this.state.employee.firstName.length == 0 || this.state.employee.lastName.length == 0) {
        this.setState({ formIncomplete: true, errorMessage: 'Fields Incomplete' });
      } else {
        this.checkEmail(this.state.employee.email, (complete) => {
          if(complete) {
            this.cleanPhone(() => {
              callback();
            });
          } else {
            this.setState({ formIncomplete: true, errorMessage: 'Must be Valid Email' });
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
      this.setState({ roleOptions: arr, employee: {...this.state.employee, role: index } });
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

  textInputFactory(placeholder, onTextChange, value, canEdit, capitalize = true, keyboard = 'default') {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={(capitalize ? 'words' : 'none')}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
        editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
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
        .then((data) => { console.log(data); this.setState({ employee: { ...this.state.employee, imageURI: data.uri }, cameraPermission: false }) })
        .catch(e => {
          console.log(e);
          this.setState({ cameraPermission: false });
        })
    }
  }

  render() {
    return(
      <View style={{flex: 1}}>
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <Modal animationType={'slide'} transparent={false} visible={this.state.addLocationsPresented} >
            <EmployeeFormAddLocation
              dismiss={() => this.setState({ addLocationsPresented: false }) }
              addLocations={(places) => this.setState({ selectedPlaces: places, formIncomplete: false }) /*this.setState({ employee: {...this.state.employee, places: places }})*/ }
            />
          </Modal>

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} imagePath={require('../../assets/icons/down.png')} />
          </View>

          <Text style={styles.textHeader} >First Name</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('First Name', (text) => this.setState({ employee: {...this.state.employee, firstName: text},formIncomplete:false}), this.state.employee.firstName, true)
            }
          </View>

          <Text style={styles.textHeader} >Last Name</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Last Name', (text) => this.setState({ employee: {...this.state.employee, lastName: text},formIncomplete:false}), this.state.employee.lastName, true)
            }
          </View>

          <Text style={styles.textHeader} >Email</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Email', (text) => this.setState({ employee: {...this.state.employee, email: text},formIncomplete:false}), this.state.employee.email, true, false, 'email-address')
            }
          </View>

          <Text style={styles.textHeader} >Birthday</Text>
          <View style={styles.dateView} >
            <DatePickerIOS
              onDateChange={(date) => { this.setState({ employee: {...this.state.employee, birthday: date.toDateString() }}) }}
              date={new Date(this.state.employee.birthday)}
              mode={'date'} maximumDate={new Date()}
            />
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('555.555.5555', (text) => this.setState({ employee: {...this.state.employee, phone: text }}), this.state.employee.phone, true, false, 'phone-pad')}
          </View>

          <Text style={styles.textHeader} >Hire Date</Text>
          <View style={styles.dateView} >
            <DatePickerIOS
              onDateChange={(date) => { this.setState({ employee: {...this.state.employee, hireDate: date.toDateString() }}) }}
              date={new Date(this.state.employee.hireDate)}
              mode={'date'} maximumDate={new Date()}
            />
          </View>

          <Text style={styles.textHeader}>Gender</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.genderOptions} selectOption={(index) => this.genderSelected(index)} />
          </View>

          <Text style={styles.textHeader}>Hair Color</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.hairOptions} selectOption={(index) => this.hairSelected(index)} />
          </View>

          <Text style={styles.textHeader}>Can create restaurants?</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.roleOptions} selectOption={(index) => this.roleSelected(index)} />
          </View>

          <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
            {(this.state.employee.imageURI == null)
              ? <Image source={require('../../assets/icons/camera.png')} resizeMode={'center'} style={styles.imageEmpty} />
              : <Image source={{uri:this.state.employee.imageURI}} style={styles.image} />
            }
          </TouchableOpacity>
          <Text style={styles.imageText}>Upload Employee Image</Text>


          <View style={styles.submitContainer} >
            <SubmitButton title={'ADD RESTAURANTS'} onPress={() => this.setState({ addLocationsPresented: true }) } />
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
        </View>
        {(this.props.isLoading)
          ? <LoadingOverlay />
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
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
  submitContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 16
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageEmpty: {
    width: 140, height: 140,
    borderRadius: 70,
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
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  dateView: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1, borderRadius: 8,
    backgroundColor: 'white'
  },
  birthdayView: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
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
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    isOwner: state.user.isOwner,
    places: state.user.myLocations,
    isLoading: state.loading.isLoading,
    user: state.user.user
  }
}

export default connect(mapStateToProps)(EmployeeForm);
