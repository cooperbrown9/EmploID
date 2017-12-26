import * as AuthActions from '../action-types/auth-action-types';

const initialState = { isLoggedIn: false, isOwner : true, sessionID: null, userID: null };

export default function user (state = initialState, action) {
  switch(action.type) {

    case AuthActions.LOGIN_OWNER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        isOwner: true,
        user: action.user
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
        user: action.user
      }

    case AuthActions.LOGIN_EMPLOYEE_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isOwner: false
      }

    default:
      return state;
  }
}
