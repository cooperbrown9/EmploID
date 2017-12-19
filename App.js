import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import { Font } from 'expo';
import MainReducer from './src/reducers/main-reducer';
import AppNavigatorWithState from './src/navigation/app-navigator';
// import Setup from './setup';
import { FONT_LOADED } from './src/action-types/setup-action-types';

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179

  state = {
    fontReady: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf')
    });
    this.setState({ fontReady: true });
    this.store.dispatch({ type: FONT_LOADED });
    console.log('app ');
  }

  // check if owner or employee...if employee, load Profile page, otherwise
  // start from home
  render() {
    return (

      <Provider store={this.store} >
        <AppNavigatorWithState />
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
