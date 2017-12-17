import * as Expo from "expo";
import React, { Component } from "react";

import App from "./App";

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';

import { Font } from 'expo';
import MainReducer from './src/reducers/main-reducer';
import AppNavigatorWithState from './src/navigation/app-navigator';

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  store = createStore(MainReducer, applyMiddleware(thunk));

  componentWillMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Expo.Font.loadAsync({
      'roboto-regular': require("./assets/Roboto-Regular.ttf")
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    } else {
    return (
      <Provider store={this.store} >
        <AppNavigatorWithState />
      </Provider>
    );
  }
  }
}
