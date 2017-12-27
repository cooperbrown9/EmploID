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

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179

  state = {
    fontLoaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
    // this.store.dispatch({ type: FONT_LOADED });
    const isOwner = await AsyncStorage.getItem(Keys.IS_OWNER);
    if(isOwner !== null) {

    } else {
      this.store.dispatch({ type: NavActions.LOGIN });
    }
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

  // check if owner or employee...if employee, load Profile page, otherwise
  // start from home
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
