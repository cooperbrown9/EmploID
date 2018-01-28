import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import LoadScreen from '../screens/LoadScreen';
import RestaurantProfileScreen from '../screens/RestaurantProfileScreen.js';

export const AppNavigator = StackNavigator({
  Home: { screen: HomeScreen },
  Load: { screen: LoadScreen },
  Profile: { screen: ProfileScreen },
  Login: { screen: LoginScreen },
  LocationProfile: { screen: RestaurantProfileScreen},
});

const AppNavigatorWithState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav}) } />
);

AppNavigatorWithState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppNavigatorWithState)
