import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigation/app-navigator';
import * as NavActions from '../action-types/nav-action-types';

const tempAction = AppNavigator.router.getActionForPathAndParams('Home');
const tempState = AppNavigator.router.getStateForAction(tempAction);

const loginAction = AppNavigator.router.getActionForPathAndParams('Login');
const loginState = AppNavigator.router.getStateForAction(loginAction);

const loadAction = AppNavigator.router.getActionForPathAndParams('Load');
const loadState = AppNavigator.router.getStateForAction(loadAction);

// to set a different home screen, get Action and State.
// to animate screens, use NavigationActions
export default function nav(state = loadState, action) {
  let newState = state;
  let tempAction = {};

  switch(action.type) {

    case 'START_LOGIN':
      const lA = AppNavigator.router.getActionForPathAndParams('Login');
      const lS = AppNavigator.router.getStateForAction(lA);
      return loginState;

    case 'START_HOME':
      const tempAction = AppNavigator.router.getActionForPathAndParams('Home');
      const tempState = AppNavigator.router.getStateForAction(tempAction);
      return tempState;

    // this is for employee logins
    case 'START_PROFILE':
      // do START_HOME but for Profile
      const tempProfile = AppNavigator.router.getActionForPathAndParams('Profile');
      const tempProfileState = AppNavigator.router.getStateForAction(tempProfile);
      return tempProfileState;

    case NavActions.EMPLOYEE_FORM:
      state.onBack = action.onBack;
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'EmployeeForm' }),
        state
      );
      return newState;

    case NavActions.RESTAURANT_FORM:
      state.onBack = action.onBack;
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'RestaurantForm' }),
        state
      );
      return newState;

    case NavActions.LOGIN:
    newState = AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: 'Login'}),
      state
    );
    return newState;

    case NavActions.HOME:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Home'}),
        state
      );
      return newState;

    case NavActions.EMPLOYEE_PROFILE:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: 'Profile',
          params: {
            dispatchFromPlace: (action.dispatchFromPlace != null) ? action.dispatchFromPlace : false
          }
        }),
        state
      );
      return newState;

    case NavActions.LOCATION_PROFILE:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'LocationProfile'}),
        state
      );
      return newState;


    case NavActions.BACK:
      newState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      return newState;

    default:
      // state = tempState;
      return state;
  }
}
