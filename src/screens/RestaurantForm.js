import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Image, Modal } from 'react-native';

import { Camera, Permissions } from 'expo';
import { connect } from 'react-redux';
import OptionView from '../ui-elements/option-view';
import * as Colors from '../constants/colors';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

// import LocationFormAddEmployee from './EmployeeFormAddLocation';

class RestaurantForm extends Component {
  constructor() {
    super();

    this.state = {
      place: {
        name: "Rusty Moose",
        address: "6969 E. Rockford Way",
        email: "hello@restaurant.com",
        phone: "555-555-5555",
        employees: [],
        imageURI: null
      },
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
    // await this.getCameraPermission();

  }

  submit = () => {
    console.log(this.state.place);

    this.props.submitForm(this.state.place);
    this.props.dismiss();
  }

  textInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE}
        style={styles.input}
        autoCorrect={false}
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
        .then((data) => { console.log(data); this.setState({ place: { ...this.state.place, imageURI: data.uri }, cameraPermission: false }) })
        .catch(e => console.log(e))
    }
  }

  render() {
    return(
      <View style={{flex: 1}} >
      <ScrollView style={styles.scrollContainer} >

        {/*
        <Modal animationType={'slide'} transparent={false} visible={this.state.addEmployeeFormPresented} >
          <LocationFormAddEmployee
            dismissModal={() => this.setState({ addEmployeeFormPresented: false })}
            addEmployees={(employees) => this.setState({ place: { ...this.state.place, employees: employees }})}
          />
        </Modal>
        */}


        <View style={styles.container} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} imagePath={require('../../assets/icons/back.png')} />
          </View>

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
            {this.textInputFactory('hello@restaurant.com', (text) => this.setState({ place: {...this.state.place, email: text}}), this.state.place.email)}
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('555.555.5555', (text) => this.setState({ place: {...this.state.place, phone: text}}), this.state.place.phone)}
          </View>

          <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
            {(this.state.place.imageURI == null)
              ? <Image source={require('../../assets/icons/camera.png')} resizeMode={'center'} style={styles.imageEmpty} />
            : <Image source={{uri:this.state.place.imageURI}} style={styles.image} />

            }
          </TouchableOpacity>
          <Text style={styles.imageText}>Upload Restaurant Image</Text>

          {/*
          <View style={styles.submitContainer} >
            <SubmitButton title={'ADD RESTAURANTS'} onPress={() => this.setState({ addEmployeeFormPresented: true }) } />
          </View>
          */}

          <TouchableOpacity style={styles.submitContainer} >
            <SubmitButton title={'CREATE LOCATION'} onPress={() => this.submit()} />
          </TouchableOpacity>

          <View style={{height: 64}}/>
        </View>
      </ScrollView>
      {(this.state.cameraPermission)
        ? <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
            <Camera ref={ref => { this.camera = ref; }} type={this.state.cameraType} style={{flex: 1}} >
              <TouchableOpacity onPress={this.takePicture} style={{ height:40, width:40 }} >
                <Image source={require('../../assets/icons/camera.png')} />
              </TouchableOpacity>
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
  image: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: 'yellow'
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
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

export default RestaurantForm;
