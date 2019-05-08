import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, StatusBar } from 'react-native';

import { connect } from 'react-redux';
import { Camera, Permissions } from 'expo';
import { TextInputMask } from 'react-native-masked-text';
import { cleanPhoneNumber } from '../util';

import * as Colors from '../constants/colors';
import * as API from '../api/api';

import axios from 'axios';
// import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

class RestaurantFormEdit extends Component {
  constructor() {
    super();

    this.cleanPhoneNumber = cleanPhoneNumber.bind(this)

    this.state = {
      place: {
        name: "Rusty Moose",
        address: "6969 E. Rockford Way",
        email: "hello@restaurant.com",
        phone: "555-555-5555",
        positions: []
      },
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
      cameraPermission: false,
      cameraType: Camera.Constants.Type.back
    };
  }

  static propTypes = {
    dismiss: PropTypes.func,
    updateLocation: PropTypes.func
  }

  componentDidMount() {
    this.setState({ place: { ...this.props.location, imageURL: this.props.location.image_url } }, () => {
      for(let i = 0; i < this.state.place.positions.length; i++) {
        for(let j = 0; j < this.state.positionOptions.length; j++) {
          if(this.state.place.positions[i] === this.state.positionOptions[j].value) {
            this.positionSelected(this.state.positionOptions[j].index);
          }
        }
      }
    });
  }

  submit = () => {
    console.log(this.state.place);

    // if(this.state.place.imageURL === this.props.location.image_url) {
    // this.props.updateLocation(this.state.place);
    // }
    // this.props.dismiss();
    this.updateLocation();
  }

  positionSelected = (index) => {
    OptionViewSplit.selectedMultiple(this.state.positionOptions, index, (arr) => {
      this.setState({ positionOptions: arr });
    });
  }

  updateLocation = () => {
    this.cleanPhoneNumber(this.state.place.phone, (phone) => {
      this.state.place.phone = phone;
      if(this.state.place.imageURL === this.props.location.image_url) {
        this.updateLocationCall();
      } else {
        var img = new FormData();
        img.append('file', {
          uri: this.state.place.imageURL,
          type: 'image/png',
          name: 'lol'
        });

        axios.post('https://emploid.herokuapp.com/upload', img).then((response) => {
          this.state.place.imageURL = response.data;
          this.updateLocationCall();
        }).catch((e) => {
          console.log(e);
        })
      }
    })
  }

  updateLocationCall = () => {
    this.state.place.positions = [];
    this.state.positionOptions.forEach(p => {
      if(p.selected) {
        this.state.place.positions.push(p.value);
      }
    })

    API.updateLocation(this.state.place, (err, loc) => {
      if(err) {
        console.log(err);
        // make this loading
        this.setState({ isRefreshing: false });
      } else {
        this.props.dismiss();
      }
    });
  }

  getCameraPermission = async() => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ cameraPermission: status === 'granted' });
  }

  takePicture = async() => {
    if(this.camera) {
      await this.camera.takePictureAsync()
        .then((data) => { console.log(data); this.setState({ place: { ...this.state.place, imageURL: data.uri }, cameraPermission: false }) })
        .catch(e => {
          console.log(e);
          this.setState({ cameraPermission: false });
        })
    }
  }

  textInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        selectionColor={Colors.BLUE}
        style={styles.input}
        autoCorrect={false}
        onChangeText={(text) => onTextChange(text)}
        value={value}
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

  render() {
    return(
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <View style={styles.backButton} >
          <RoundButton onPress={this.props.dismiss} imagePath={require('../../assets/icons/back.png')} />
        </View>
        <ScrollView style={styles.scrollContainer} >
          <View style={styles.container} >
            <View style={{height:124}} />


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
              {this.phoneFactory('(555) 555-5555')}
              {/*this.textInputFactory('555.555.5555', (text) => this.setState({ place: {...this.state.place, phone: text}}), this.state.place.phone)*/}
            </View>

            <Text style={styles.textHeader}>Choose Positions</Text>
            <View style={styles.optionContainer} >
              <OptionViewSplit options={this.state.positionOptions} selectOption={(index) => this.positionSelected(index)} />
            </View>

            {/*
            <TouchableOpacity onPress={() => this.getCameraPermission()} style={styles.imageContainer} >
              {(this.state.place.imageURL == null)
                ? <Image source={require('../../assets/icons/camera.png')} resizeMode={'center'} style={styles.imageEmpty} />
                : <Image source={{ uri:this.state.place.imageURL }} style={styles.image} />
              }
            </TouchableOpacity>
            <Text style={styles.imageText}>Upload Restaurant Image</Text>
            */}
            <TouchableOpacity style={styles.submitContainer} >
              <SubmitButton title={'UPDATE LOCATION'} onPress={() => this.submit()} />
            </TouchableOpacity>

            <View style={{height: 64}}/>
          </View>
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
    location: state.detail.location
  }
}

export default connect(mapStateToProps)(RestaurantFormEdit);
