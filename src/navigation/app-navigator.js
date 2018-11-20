import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import LoadScreen from '../screens/LoadScreen';
import RestaurantProfileScreen from '../screens/RestaurantProfileScreen.js';
import EmployeeForm from '../screens/EmployeeForm';
import RestaurantForm from '../screens/RestaurantForm';

export const AppNavigator = createStackNavigator({
  Load: { screen: LoadScreen },
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen },
  LocationProfile: { screen: RestaurantProfileScreen },
  EmployeeForm: { screen: EmployeeForm },
  RestaurantForm: { screen: RestaurantForm }
});

// const AppNavigatorWithState = ({ dispatch, nav }) => (
  // <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav}) } />
// );

// AppNavigatorWithState.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // nav: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
// return {}
// });
export default AppNavigator;
// export default connect(mapStateToProps)(AppNavigatorWithState)
