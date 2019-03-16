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

// TODO Phone number
// COMBAK PlaceForm: Break up address fields
// "upload restaurant logo" instead
// search

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179

  state = {
    fontLoaded: false
  }

  async componentDidMount() {
    // await this.clearKeys();
    console.disableYellowBox = true;
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf')
    });
    this.cacheImages()
    this.setState({ fontLoaded: true });
  }

  cacheImages() {
    let images = [
      require('./assets/images/chef1.png'),
    ]
    return Asset.fromModule(images[0]).downloadAsync()
    // return Image.prefetch(images[0])
    // return Image.prefetch('https://m.media-amazon.com/images/S/aplus-media/vc/88a2891b-c398-4a59-a32b-d7621eccf0a4._CR0,0,300,300_PT0_SX300__.jpg')
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
