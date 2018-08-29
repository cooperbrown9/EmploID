import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, AsyncStorage } from 'react-native';

import { connect } from 'react-redux';
import axios from 'axios';
import * as Keys from '../constants/keys';
import * as AuthActions from '../action-types/auth-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as API from '../api/api';

class LoadScreen extends Component {

  static navigationOptions = {
    header: null
  }

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
          role: response.user.can_create_places,
          canCreatePlaces: response.user.can_create_places
        });
        return this.props.dispatch({ type: 'START_HOME' });
      }
    })
  }

  async clearKeys() {
    await AsyncStorage.removeItem(Keys.IS_OWNER);
    await AsyncStorage.removeItem(Keys.USER_ID);
    await AsyncStorage.removeItem(Keys.SESSION_ID);
  }

  render() {
    return(
      <View style={styles.container} >
        <ActivityIndicator size="large" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(LoadScreen);
