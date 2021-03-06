  import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, DatePickerIOS, TouchableOpacity, StyleSheet, TextInput, Image, StatusBar } from 'react-native';

import { connect } from 'react-redux';

// import EmployeeFormAddLocationEdit from './EmployeeFormAddLocationEdit';
import OptionView from '../../ui-elements/option-view';
// import OptionViewSplit from '../../ui-elements/option-view-split';

import { Camera, Permissions } from 'expo';
import { TextInputMask } from 'react-native-masked-text';

import * as Colors from '../../constants/colors';
import * as API from '../../api/api';
// import * as DataBuilder from '../../api/data-builder';
import * as DetailActions from '../../action-types/detail-action-types';
import * as util from '../../util';

import axios from 'axios';
import SubmitButton from '../../ui-elements/submit-button';
import RoundButton from '../../ui-elements/round-button';

class EmployeeFormEdit extends Component {
  constructor() {
    super();

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
      roleOptions: [
        { value: 'No', selected: false, index: 0 },
        { value: 'Yes', selected: false, index: 1 }
      ],
      cameraPermission: false,
      cameraType: Camera.Constants.Type.back
    };
  }

  static propTypes = {
    dismiss: PropTypes.func,
    submitForm: PropTypes.func,
    places: PropTypes.array,
    edit: PropTypes.bool,
    updateEmployee: PropTypes.func
  }
  static defaultPropTypes = {
    edit: false
  }

  componentWillMount() {
    this.setState({ employee: {
      ...this.props.employee, firstName: this.props.employee.first_name, role: this.props.employee.role,
      lastName: this.props.employee.last_name, imageURL: this.props.employee.image_url, hireDate: this.props.employee.hire_date,
      canCreatePlaces: this.props.employee.can_create_places
    }});
  }

  componentDidMount() {
    this.genderSelected(this.state.employee.gender);
    this.hairSelected(this.state.employee.hair);
    // debugger
    this.roleSelected(
      (this.state.employee.canCreatePlaces) ? 1 : 0
      )
    if(this.props.employee.image_url != null) {
      this.setState({ employee: { ...this.state.employee, imageURL: this.state.employee.image_url }});
    }
  }

  submit = () => {
    let data = {
      "userID": this.props.userID,
      ...this.state.employee
    }
    data.phone = util.cleanPhoneNumber(this.state.employee.phone);

    // if images arent the same, image was changed
    if(this.state.employee.imageURL != this.state.employee.image_url) {
      var img = new FormData();
      img.append('file', {
        uri: this.state.employee.imageURL,
        type: 'image/png',
        name: 'lol'
      });

      axios.post('https://emploid.herokuapp.com/upload', img).then((response) => {
        data.imageURL = response.data;
        API.updateUser(data, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            this.getUpdatedUser();
          }
        });
      });
    } else {
      API.updateUser(data, (err, data) => {
        if(err) {
          console.log(err);
        } else {
          this.getUpdatedUser();
        }
      });
    }
  }

  getUpdatedUser = () => {
    API.getUser(this.state.employee._id, (err, emp) => {
      if(err) {
        console.log(err);
      } else {
        this.props.dispatch({ type: DetailActions.SET_USER, user: emp });
        this.props.dismiss();
      }
    });
  }

  genderSelected = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr, employee: {...this.state.employee, gender: index } });
    });
  }

  hairSelected = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr, employee: {...this.state.employee, hair: index } });
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

  getCameraPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ cameraPermission: status === 'granted' });
  }

  takePicture = async() => {
    if(this.camera) {
      await this.camera.takePictureAsync()
        .then((data) => { this.setState({ employee: { ...this.state.employee, imageURL: data.uri }, cameraPermission: false }) })
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

  textInputFactory(placeholder, onTextChange, value, capitalize = true, keyboard = 'default', canEdit) {
    return (
      <TextInput
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={(capitalize ? 'words' : 'none')}
        onChangeText={(text) => onTextChange(text)}
        value={value}
        editable={canEdit} keyboardType={keyboard}
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

  bdayTextInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.birthdayInput}
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={value}
        keyboardType={'numeric'}
      />
    )
  }

  render() {
    if(!this.state.employee) {
      return(
        <View></View>
      )
    }
    return(
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <View style={styles.backButton} >
          {(!this.state.cameraPermission)
            ? <RoundButton imagePath={require('../../../assets/icons/down.png')} onPress={this.props.dismiss} />
          : null
          }
        </View>
        <ScrollView style={styles.scrollContainer} >
          <View style={{height:124}} />
          <View style={styles.container} >

            {/*<Modal animationType={'slide'} transparent={false} visible={this.state.addLocationsPresented} >
              <EmployeeFormAddLocationEdit
                dismiss={(callback) => this.setState({ addLocationsPresented: false }) }
                addLocations={(places) => this.setState({ employee: { ...this.state.employee, places: places }}) }
              />
            </Modal>
            */}


            <Text style={styles.textHeader} >First Name</Text>
            <View style={styles.inputView} >
              {
                this.textInputFactory('First Name', (text) => this.setState({ employee: {...this.state.employee, firstName: text}}), this.state.employee.firstName, true)
              }
            </View>

            <Text style={styles.textHeader} >Last Name</Text>
            <View style={styles.inputView} >
              {
                this.textInputFactory('Last Name', (text) => this.setState({ employee: {...this.state.employee, lastName: text}}), this.state.employee.lastName, true)
              }
            </View>

            <Text style={styles.textHeader} >Email</Text>
            <View style={styles.inputView} >
              {
                this.textInputFactory('Email', (text) => this.setState({ employee: {...this.state.employee, email: text}}), this.state.employee.email, false, 'email-address', true)
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
              {this.phoneFactory('(555) 555-5555')}
              {/*this.textInputFactory('555.555.5555', (text) => this.setState({ employee: {...this.state.employee, phone: text}}), this.state.employee.phone, true)*/}
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

            {/*
            <Text style={styles.textHeader}>Can create restaurants?</Text>
            <View style={styles.optionContainer} >
              <OptionView options={this.state.roleOptions} selectOption={(index) => this.roleSelected(index)} />
            </View>
            */}

            <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
              {(this.state.employee.imageURL == null || this.state.employee.imageURL == '')
                ? <Image source={require('../../../assets/icons/camera.png')} resizeMode={'contain'} style={styles.imageEmpty} />
                : <Image source={{uri:this.state.employee.imageURL}} style={styles.image} />
              }
            </TouchableOpacity>
            <Text style={styles.imageText}>Upload Employee Image</Text>

            {/*
            <View style={styles.submitContainer} >
              <SubmitButton title={'EDIT RESTAURANTS'} onPress={() => this.setState({ addLocationsPresented: true }) } />
            </View>
            */}
            <View style={styles.submitContainer} >
              <SubmitButton title={'UPDATE EMPLOYEE'} onPress={() => this.submit()} />
            </View>

            <View style={{height: 64}}/>
          </View>
        </ScrollView>
        {(this.state.cameraPermission)
          ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
              <Camera ref={ref => { this.camera = ref; }} type={this.state.cameraType} style={{flex: 1, justifyContent:'center', alignItems:'center'}} >
                <TouchableOpacity style={{position:'absolute',right:16,top:64}} onPress={this.switchCameraType}>
                  <Image source={require('../../../assets/icons/switch.png')} style={{height: 40, width: 40,tintColor:'white'}} resizeMode={'contain'} />
                </TouchableOpacity>
                <Image style={{height: 300, width: 300, zIndex: 10004,tintColor:'white'}} source={require('../../../assets/images/circle.png')} resizeMode={'contain'}/>
                <View style={{height: 64, position:'absolute', bottom: 64, left: 16, right: 16, flexDirection: 'row', backgroundColor:'transparent', justifyContent:'space-around'}}>
                  <TouchableOpacity onPress={() => this.setState({cameraPermission:false})} style={{height:64,width:128, borderRadius:16, backgroundColor:Colors.BLUE, justifyContent:'center',alignItems:'center'}} >
                    <Image style={{height:32, width:32, tintColor:'white'}} source={require('../../../assets/icons/cancel.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.takePicture} style={{height:64,width:128,borderRadius:16, backgroundColor:Colors.BLUE,justifyContent:'center',alignItems:'center' }} >
                    <Image style={{height:32, width:32, tintColor:'white'}} source={require('../../../assets/icons/camera.png')} />
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
    width: 100, height: 100,
    // borderRadius: 70,
    tintColor: Colors.BLUE
  },
  image: {
    width: 140, height: 140,
    borderRadius: 70,
    borderWidth: 2, borderColor: Colors.BLUE
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
    marginLeft: 16, marginRight: 16, marginBottom: 16,
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
    places: state.user.myLocations,
    employee: state.detail.user,
    userID: state.detail.user._id
  }
}

export default connect(mapStateToProps)(EmployeeFormEdit);
