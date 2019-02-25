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
// TODO close on update forms acts as a submit, instead of dismiss
// TODO TODO TODO add employees to restaurants from Employee Roster
// TODO leave employees without image, without the image
// TODO round corners on all boxes
// TODO navigate to employee profile from their box on restaurant profile
// TODO delete employees
// COMBAK PlaceForm: Break up address fields
// "upload restaurant logo" instead
// search
// filter modal
// float all edit buttons
// swipe to navigate -- check it out
// if image is not selected, send it up as null
// clear Detail USer/Location data so
// access camera roll for photos
// camera icon not showing up
// KeyboardAvoidingView on both forms
// alphabetize restaurants and employees roster
// on profile, fix image, scrollview with tabs over it
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

    // config for getting network calls in Reactotron
    // Reactotron
    //   .configure({
    //     name: 'EmploID'
    //   })
    //   .use(trackGlobalErrors())
    //   .use(openInEditor())
    //   .use(overlay())
    //   .use(asyncStorage())
    //   .use(networking())
    //   .connect()

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
