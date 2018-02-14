import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, AsyncStorage } from 'react-native';

import { connect } from 'react-redux';
import axios from 'axios';
import * as Keys from '../constants/keys';
import * as AuthActions from '../action-types/auth-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as API from '../api/api';

class LoadScreen extends Component {


  constructor() {
    super();

    this.state = {
      verifySessionComplete: false,
      getOwnerComplete: false
    }
  }

  async componentDidMount() {
    // make this method easier
    // await this.checkOwnerThenLogin();
    await this.login();
  }

  async login() {
    const userID = await AsyncStorage.getItem(Keys.USER_ID);
    const sessionID = await AsyncStorage.getItem(Keys.SESSION_ID);

    var data = {
      "userID": userID,
      "sessionID": sessionID
    }

    API.verifySession(data, async(err, response) => {
      if(err) {
        console.log(err);
        debugger;
        await AsyncStorage.removeItem(Keys.USER_ID);
        await AsyncStorage.removeItem(Keys.SESSION_ID);
        this.props.dispatch({ type: 'START_LOGIN' });
      } else {
        console.log(response);
        this.props.dispatch({
          type: AuthActions.LOGIN_SUCCESS,
          user: response.user,
          sessionID: response.session_id,
          userID: response.user._id,
          role: response.user.role
        });
        return this.props.dispatch({ type: 'START_HOME' });
      }
    })
  }

  // isOwner is not null, so now checks to see if stored session and userID are
  // still valid. If they are, dispatch START_HOME
  // handleLogin = async() => {
  //   const isOwner = await AsyncStorage.getItem(Keys.IS_OWNER);
  //   const userID = await AsyncStorage.getItem(Keys.USER_ID);
  //   const sessionID = await AsyncStorage.getItem(Keys.SESSION_ID);
  //   console.log('sessionID', sessionID);
  //   // user is an owner
  //   if(isOwner === 'true') {
  //     // user dummy session so it always goes to LOGIN
  //     var data = {
  //       "sessionID": sessionID,
  //       "ownerID": userID
  //     }
  //
  //     API.verifySessionGetOwner(data, async (err, response) => {
  //       if(err) {
  //         console.log(err);
  //         await AsyncStorage.removeItem(Keys.IS_OWNER);
  //         await AsyncStorage.removeItem(Keys.USER_ID);
  //         await AsyncStorage.removeItem(Keys.SESSION_ID);
  //         this.props.dispatch({ type: 'START_LOGIN' });
  //         // this.props.dispatch({ type: AuthActions.LOGIN_OWNER_ERROR });
  //       } else {
  //         console.log(response);
  //         this.props.dispatch({
  //           type: AuthActions.LOGIN_OWNER_SUCCESS,
  //           user: response.owner,
  //           sessionID: response.session_id,
  //           userID: response.owner._id
  //         });
  //         return this.props.dispatch({ type: 'START_HOME' });
  //       }
  //     });
  //   } else {
  //     // user is an employee
  //     API.getEmployee(userID, (e, response) => {
  //       if(e) {
  //         debugger;
  //         Alert.alert(e.message);
  //       } else {
  //         console.log(response);
  //         this.props.dispatch({
  //           type: AuthActions.LOGIN_EMPLOYEE_SUCCESS,
  //           user: response,
  //           userID: response._id
  //         });
  //         this.props.dispatch({ type: 'START_PROFILE' });
  //       }
  //     });
  //     console.log('user');
  //   }
  //
  // }
  //
  //
  //


  async clearKeys() {
    await AsyncStorage.removeItem(Keys.IS_OWNER);
    await AsyncStorage.removeItem(Keys.USER_ID);
    await AsyncStorage.removeItem(Keys.SESSION_ID);
  }

  render() {
    return(
      <View style={styles.container} >
        <ActivityIndicator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(LoadScreen);
