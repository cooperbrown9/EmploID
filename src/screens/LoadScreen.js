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

    // this.checkLoginStatus();
    const isOwner = await AsyncStorage.getItem(Keys.IS_OWNER);

    // if user has logged in

    const userID = await AsyncStorage.getItem(Keys.USER_ID);
    const sessionID = await AsyncStorage.getItem(Keys.SESSION_ID);

    await this.verifySessionAsync(sessionID, userID);
  }






  verifySessionAsync = (sessionID, userID) => {
    return new Promise((resolve) => {
      console.log(resolve);
      debugger;
      var data = {
        "ownerID": userID,
        "sessionID": sessionID
      }
      // verify the stored session is still valid
      API.verifySessionOwner(data, (e1, response1) => {
        if(e1) {
          // go to login page, invalid session
          debugger;
          console.log('error verifying session');
          this.clearKeys();
          this.props.dispatch({ type: 'START_LOGIN' });
        } else {
          // session is valid
          console.log(response1);

          // get owner object
          this.getOwner(userID);
        }
      });
    });
  }









  // verifySession = (sessionID, userID) => {
  //   var data = {
  //     "ownerID": userID,
  //     "sessionID": sessionID
  //   }
  //   // verify the stored session is still valid
  //   API.verifySessionOwner(data, (e1, response1) => {
  //     if(e1) {
  //       // go to login page, invalid session
  //       debugger;
  //       console.log('error verifying session');
  //       this.clearKeys();
  //       this.props.dispatch({ type: 'START_LOGIN' });
  //     } else {
  //       // session is valid
  //       console.log(response1);
  //
  //       // get owner object
  //       this.getOwner(userID);
  //     }
  //   })
  // }

  getOwner = (userID) => {
    API.getOwner(userID, (e2, response2) => {
      if(e2 && !this.state.getOwnerComplete) {
        debugger;
        console.log('couldnt get owner', e2);
        this.props.dispatch({ type: 'START_LOGIN' });
      } else {
        this.setState({ getOwnerComplete: true });
        debugger;
        console.log(response2);
        this.props.dispatch({ type: AuthActions.USER_LOADED, user: response2 });
        this.props.dispatch({ type: NavActions.HOME });
      }
    });
  }

  async checkLoginStatus() {
    // checks to see if there was a previous login
    const isOwner = await AsyncStorage.getItem(Keys.IS_OWNER);

    // if user has logged in
    if(isOwner !== null) {
      const userID = await AsyncStorage.getItem(Keys.USER_ID);
      const sessionID = await AsyncStorage.getItem(Keys.SESSION_ID);


      // check to see if user is owner or employee
      if(isOwner === 'true') {
        // this.verifySession(sessionID, userID);
        // verify the stored session is still valid
        const r1 = await API.verifySessionOwner({"sessionID": sessionID, "ownerID": userID}, async() => {
          if(r1.data.success) {
            const r2 = await API.getOwner(userID);
            debugger;
          } else {
            console.log(r1);
            debugger;
          }
        });

      } else {
        // is employee
        // login employee
        console.log('employee login');
      }
    } else {
      // never logged in, take to login page
      await this.clearKeys();
      this.props.dispatch({ type: 'START_LOGIN' });

      // this.props.dispatch({ type:  })
    }
  }

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
