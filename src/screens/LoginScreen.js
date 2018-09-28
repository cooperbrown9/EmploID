import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, StyleSheet, Alert, AsyncStorage, Modal } from 'react-native';
import axios from 'axios';

import { connect } from 'react-redux';

import { BLUE, DARK_GREY, BACKGROUND_GREY, MID_GREY } from '../constants/colors';
import * as Colors from '../constants/colors';
import * as API from '../api/api';
import { handleLoginError } from '../util/error-manager';

import OptionView from '../ui-elements/option-view';
import SubmitButton from '../ui-elements/submit-button';
import ForgotPassword from './ForgotPassword';

import * as Keys from '../constants/keys';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as PermissionActions from '../action-types/permission-action-types';

class LoginScreen extends Component {

  constructor() {
    super();

    this.handleLoginError = handleLoginError.bind(this);

    this.state = {
      email: '',
      password: '',
      forgotPWPresented: false,
      options: [
        { value: 'Owner', selected: true, index: 0},
        { value: 'Employee', selected: false, index: 1}
      ]
    }
  }

  static navigationOptions = {
    header: null
  }


  componentDidMount() {

  }

  login = () => {
    let data = {
      "email": this.state.email,
      "password": this.state.password
    }
    API.login(data, async(err, response) => {
      if(err) {
        this.handleLoginError(err.response.status, (message) => {
          Alert.alert(message);
        });
      } else {
        await AsyncStorage.setItem(Keys.USER_ID, response.user._id);
        await AsyncStorage.setItem(Keys.SESSION_ID, response.session_id);

        this.props.dispatch({
          type: AuthActions.LOGIN_SUCCESS,
          user: response.user,
          sessionID: response.session_id,
          userID: response.user._id,
          role: response.user.can_create_places
        });
        this.props.dispatch({ type: PermissionActions.SET_IS_PLACE_CREATOR, isCreator: response.user.can_create_places });

        this.props.dispatch({ type: NavActions.HOME });
      }
    })
  }

  presentForgotPassword() {
    this.setState({ forgotPWPresented: true });
  }

  resetPassword() {
    let email = {
      'email': this.state.email
    }
    API.resetPassword(email, (err, status) => {
      if(err) {
        this.setState({ forgotPWPresented: false }, () => {
          setTimeout(() => {
            Alert.alert('Your password could not be reset at this time!');

          }, 1000)
        })
      } else {
        this.setState({ forgotPWPresented: false }, () => {
          setTimeout(() => {
            Alert.alert('Check your email for instructions!');
          }, 1000)
        })
      }
    })
  }

  textInputFactory(placeholder, onTextChange, value, canEdit=true, keyboard='default', secure=false) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={false}
        onChangeText={(text) => onTextChange(text)}
        value={value} secureTextEntry={secure}
        editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
      />
    )
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <View style={styles.logoContainer} >
            <Image style={styles.logo} source={require('../../assets/images/logo-1.png')} resizeMode={'center'} />
          </View>

          {/*
          <View style={styles.headerView}>
            <Text style={styles.loginText}>Login</Text>
          </View>
          */}

          {/*<View style={styles.optionView} >
            <OptionView options={this.state.options} selectOption={(index) => this._positionSelected(index)} />
          </View>*/}

          <View style={styles.inputContainer} >
            <View style={styles.inputView} >
              {this.textInputFactory('Email', (text) => {this.setState({email: text})}, this.state.email)}
            </View>
            <View style={styles.inputView} >
              {this.textInputFactory('Password', (text) => this.setState({password:text}), this.state.password, true, 'default', true)}
            </View>
          </View>

          <Text onPress={() => this.presentForgotPassword()} style={styles.forgotPW}>Forgot Password?</Text>

          <View style={styles.buttonContainer} >
            <SubmitButton bgColor={'black'} onPress={this.login} title={'LOGIN'} />
          </View>

          <Modal animationType={'slide'} transparent={false} visible={this.state.forgotPWPresented} >
            <ForgotPassword
              email={this.state.email}
              setEmail={(email) => this.setState({ email: email })}
              resetPassword={this.resetPassword.bind(this)}
              dismiss={() => this.setState({ forgotPWPresented: false })}
            />
          </Modal>

        </View>
      </ScrollView>
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
    backgroundColor: Colors.BACKGROUND_GREY
  },
  logoContainer: {
    marginTop: 64, marginLeft: 32, marginRight: 32,
    height: 200,
    justifyContent: 'center', alignItems: 'center'
  },
  logo: {
    flex: 1
  },
  optionView: {
    marginTop: 32, marginLeft: 32, marginRight: 32
  },
  headerView: {
    marginTop: 32, marginLeft: 32, marginRight: 32
  },
  buttonContainer: {
    marginLeft: 32, marginRight: 32, marginTop: 64,
    justifyContent: 'flex-end'
  },
  forgotPW: {
    textAlign: 'center',
    fontSize: 18, fontFamily: 'roboto-regular',
    color: 'black'
  },
  // input: {
  //   flex: 1,
  //   fontSize: 24,
  //   borderBottomColor: 'black', borderBottomWidth: 2,
  //   marginLeft: 32, marginRight: 32, marginBottom: 48,
  //   color: 'black',
  //   fontFamily: 'roboto-regular'
  // },
  inputContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 64
  },
  loginText: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'roboto-bold',
    color: 'white'
  },
  headerView: {
    flex: 1,
    marginTop: 120,
    justifyContent: 'center'
  },
  input: {
    marginLeft: 16,
    fontSize: 18,
    color: 'black',
    fontFamily: 'roboto-regular'
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 16, marginRight: 8, marginLeft: 8,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(LoginScreen);
