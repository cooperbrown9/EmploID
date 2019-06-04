import React from 'react';
import { AsyncStorage, StyleSheet, Text,
  Image, View, ActivityIndicator } from 'react-native';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import { Asset, Font } from 'expo';
import MainReducer from './src/reducers/main-reducer';
// import AppNavigatorWithState from './src/navigation/app-navigator';
import AppNavigator from './src/navigation/app-navigator';

import * as Keys from './src/constants/keys';

import { FONT_LOADED } from './src/action-types/setup-action-types';
import * as NavActions from './src/action-types/nav-action-types';

// TODO fire
// keyboardavoidingview on phone field
// COMPLETE FORM ERROR

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179

  state = {
    fontLoaded: false
  }

  async componentDidMount() {
    console.disableYellowBox = true;
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf')
    });
    await this.cacheImagesAsync()
    this.setState({ fontLoaded: true });
  }

  cacheImagesAsync() {
    let images = [
      require('./assets/images/chef1.png'),
      require('./assets/images/back-arrow.png'),
      require('./assets/images/circle.png'),
      require('./assets/icons/add.png'),
      require('./assets/icons/back.png'),
      require('./assets/icons/camera.png'),
      require('./assets/icons/cancel.png'),
      require('./assets/icons/card.png'),
      require('./assets/icons/check.png'),
      require('./assets/icons/dots.png'),
      require('./assets/icons/ellipsis.png'),
      require('./assets/icons/pencil.png'),
      require('./assets/icons/profile-male.png'),
      require('./assets/icons/profile.png'),
      require('./assets/icons/search.png'),
      require('./assets/icons/social.png'),
      require('./assets/icons/down.png'),
      require('./assets/icons/crown.png')
    ]

    return images.map(img => {
      return Asset.fromModule(img).downloadAsync()
    })
  }

  cacheImage() {
    return Image.prefetch('https://emploid.s3.us-west-2.amazonaws.com/1550883646647.png');
  }

  async clearKeys() {
    await AsyncStorage.removeItem(Keys.IS_OWNER);
    await AsyncStorage.removeItem(Keys.SESSION_ID);
    await AsyncStorage.removeItem(Keys.USER_ID);
  }

  checkKeys() {
    AsyncStorage.getItem(Keys.IS_OWNER, (v1) => {
      if(v1 == true) {
        AsyncStorage.getItem(Keys.SESSION_ID, (v2) => {
          AsyncStorage.getItem(Keys.USER_ID, (v3) => {
          });
        });
      }
    });
  }

  render() {
    return (
      <Provider store={this.store} >
        {(this.state.fontLoaded) ? <AppNavigator /> : <View><ActivityIndicator/></View> }
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
