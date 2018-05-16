import React from 'react';
import { AsyncStorage, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import { Font } from 'expo';
import MainReducer from './src/reducers/main-reducer';
import AppNavigatorWithState from './src/navigation/app-navigator';

import * as Keys from './src/constants/keys';

import { FONT_LOADED } from './src/action-types/setup-action-types';
import * as NavActions from './src/action-types/nav-action-types';

// TODO PlaceForm: Break up address fields
// TODO Phone number
// TODO access camera roll for photos
// TODO clear Detail USer/Location data so
// TODO KeyboardAvoidingView on both forms
// TODO close on update forms acts as a submit, instead of dismiss
// TODO search
// TODO add employees to restaurants from Employee Roster
// TODO leave employees without image, without the image
// TODO "upload restaurant logo" instead
// TODO round corners on all boxes
// TODO alphabetize restaurants and employees roster
// TODO navigate to employee profile from their box on restaurant profile
// TODO swipe to navigate -- check it out
// TODO delete employees
// TODO if image is not selected, send it up as null
// TODO camera icon not showing up
// TODO float all edit buttons
// TODO on profile, fix image, scrollview with tabs over it
// add phone call to restaurant cell
// basically remove all restaurant image stuff
// changing tabs reformats the screen -- make concrete height of scroll

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179

  state = {
    fontLoaded: false
  }

  // isOwner is not null, so now checks to see if stored session and userID are
  // still valid. If they are, dispatch START_HOME
  async componentDidMount() {
    // await this.clearKeys();
    console.disableYellowBox = true;
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  async clearKeys() {
    await AsyncStorage.removeItem(Keys.IS_OWNER);
    await AsyncStorage.removeItem(Keys.SESSION_ID);
    await AsyncStorage.removeItem(Keys.USER_ID);
  }

  checkKeys() {
    AsyncStorage.getItem(Keys.IS_OWNER, (v1) => {
      console.log(v1);
      if(v1 == true) {
        console.log('== works', v2);
        AsyncStorage.getItem(Keys.SESSION_ID, (v2) => {
          console.log(v2);
          AsyncStorage.getItem(Keys.USER_ID, (v3) => {
            console.log(v3);
          });
        });
      }
    });
  }

  render() {
    return (
      <Provider store={this.store} >
        {(this.state.fontLoaded) ? <AppNavigatorWithState /> : <View><ActivityIndicator/></View> }
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
