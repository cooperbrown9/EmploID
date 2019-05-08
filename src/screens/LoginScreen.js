import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Image, 
  StyleSheet, Alert, AsyncStorage, Modal, Dimensions, KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';

import * as Colors from '../constants/colors';
import * as API from '../api/api';
import { handleLoginError } from '../util/error-manager';

import SubmitButton from '../ui-elements/submit-button';
import ForgotPassword from './ForgotPassword';

import * as Keys from '../constants/keys';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';
import * as PermissionActions from '../action-types/permission-action-types';

const FRAME = Dimensions.get('window');

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
        console.log(err)
        // this.handleLoginError(err.response.status, (message) => {
          Alert.alert('Incorrect email or password!');
        // });
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
        this.props.navigation.navigate(NavActions.HOME);
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
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={value} secureTextEntry={secure}
        editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
      />
    )
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} padding >

          <View style={styles.logoContainer} >
            <Image style={styles.logo} source={require('../../assets/images/logo-1.png')} resizeMode={'center'} />
          </View>

          <KeyboardAvoidingView style={styles.inputContainer} >
            <View style={styles.inputView} >
              {this.textInputFactory('Email', (text) => {this.setState({email: text})}, this.state.email, true, 'email-address')}
            </View>
            <View style={styles.inputView} >
              {this.textInputFactory('Password', (text) => this.setState({password:text}), this.state.password, true, 'default', true)}
            </View>
          </KeyboardAvoidingView>

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
    height: 200, width: FRAME.width - 64
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
