import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigation/app-navigator';
import * as NavActions from '../action-types/nav-action-types';

const tempAction = AppNavigator.router.getActionForPathAndParams('Home');
const tempState = AppNavigator.router.getStateForAction(tempAction);

const loginAction = AppNavigator.router.getActionForPathAndParams('Login');
const loginState = AppNavigator.router.getStateForAction(loginAction);

// to set a different home screen, get Action and State.
// to animate screens, use NavigationActions
export default function nav(state = tempState, action) {
  let newState = state;
  let tempAction = {};

  switch(action.type) {

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
        NavigationActions.navigate({ routeName: 'Profile'}),
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
