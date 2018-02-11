import * as AuthActions from '../action-types/auth-action-types';

const initialState = {
  isLoggedIn: false, isOwner : true,
  sessionID: null, userID: null,
  myEmployees: [], myLocations: []
};

export default function user (state = initialState, action) {
  switch(action.type) {

    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state
      }

    case AuthAction.LOGIN_ERROR:
      return {
        ...state
      }

    case AuthActions.LOGIN_OWNER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isOwner: true,
        user: action.user,
        sessionID: action.sessionID,
        userID: action.userID
      }

    case AuthActions.LOGIN_OWNER_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isOwner: false
      }

    case AuthActions.LOGIN_EMPLOYEE_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isOwner: false,
        user: action.user,
        userID: action.userID
      }

    case AuthActions.LOGIN_EMPLOYEE_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isOwner: false
      }

    case AuthActions.SET_EMPLOYEES:
      return {
        ...state,
        myEmployees: action.employees
      }

    case AuthActions.SET_LOCATIONS:
      return {
        ...state,
        myLocations: action.locations
      }

    default:
      return state;
  }
}
