import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import MainReducer from './src/redux/reducers/main-reducer';
import AppNavigatorWithState from './src/navigation/app-navigator';

export default class App extends React.Component {

  store = createStore(MainReducer, applyMiddleware(thunk));

  // mockups: https://projects.invisionapp.com/share/QWEPTE332#/screens/266694179
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
