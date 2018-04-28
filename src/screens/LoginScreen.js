import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Alert, AsyncStorage } from 'react-native';
import axios from 'axios';

import { connect } from 'react-redux';

import { BLUE, DARK_GREY, BACKGROUND_GREY, MID_GREY } from '../constants/colors';
// import { loginOwner, loginEmployee, getOwner, getEmployee } from '../api/api';
import * as API from '../api/api';

import OptionView from '../ui-elements/option-view';
import SubmitButton from '../ui-elements/submit-button';

import * as Keys from '../constants/keys';
import * as NavActions from '../action-types/nav-action-types';
import * as AuthActions from '../action-types/auth-action-types';

class LoginScreen extends Component {

  constructor() {
    super();

    // this.loginOwner = loginOwner.bind(this);
    // this.loginEmployee = loginEmployee.bind(this);
    // this.getOwner = getOwner.bind(this);
    // this.getEmployee = getEmployee.bind(this);

    this.state = {
      email: '',
      password: '',
      isOwner: true,
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
        debugger;
        Alert.alert('LOGIN ERROR ' + err.message);
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
        this.props.dispatch({ type: NavActions.HOME });
      }
    })
  }

  _positionSelected = (index) => {
    OptionView.selectedExclusive(this.state.options, index, (arr) => {
      this.setState({ options: arr });
      if(arr[0].selected) {
        this.setState({ isOwner: true });
      } else {
        this.setState({ isOwner: false });
      }
    });
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <View style={styles.headerView}>
            <Text style={styles.loginText}>Login</Text>
          </View>

          {/*<View style={styles.optionView} >
            <OptionView options={this.state.options} selectOption={(index) => this._positionSelected(index)} />
          </View>*/}

          <View style={styles.inputView} >
            <TextInput
              selectionColor={BLUE}
              style={styles.input}
              autoCorrect={false} autoCapitalize={'none'}
              placeholder={'Email'} placeholderTextColor={DARK_GREY}
              onChangeText={(text) => this.setState({ email: text })}
            />
            <TextInput
              selectionColor={BLUE}
              style={styles.input}
              autoCorrect={false} autoCapitalize={'none'}
              placeholder={'Password'} placeholderTextColor={DARK_GREY}
              secureTextEntry={false}
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>

          <View style={styles.buttonContainer} >
            <SubmitButton onPress={this.login} title={'LOGIN'} />
          </View>

        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_GREY
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BACKGROUND_GREY
  },
  optionView: {
    marginTop: 32, marginLeft: 32, marginRight: 32
  },
  headerView: {
    marginTop: 32, marginLeft: 32, marginRight: 32
  },
  buttonContainer: {
    marginLeft: 32, marginRight: 32, marginTop: 64
  },
  input: {
    flex: 1,
    fontSize: 24,
    borderBottomColor: 'black', borderBottomWidth: 2,
    marginLeft: 32, marginRight: 32, marginBottom: 48,
    color: 'black',
    fontFamily: 'roboto-regular'
  },
  inputView: {
    marginLeft: 16, marginRight: 16, marginTop: 64
  },
  loginText: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'roboto-regular'
  },
  headerView: {
    flex: 1,
    marginTop: 120,
    justifyContent: 'center'
  }
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(LoginScreen);
