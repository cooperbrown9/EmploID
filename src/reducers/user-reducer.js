import * as AuthActions from '../action-types/auth-action-types';

const initialState = { isOwner : true };

export default function user (state = initialState, action) {
  switch(action.type) {

    case AuthActions.LOGIN_OWNER_SUCCESS:
      return {
        ...state
      }

    case AuthActions.LOGIN_OWNER_ERROR:
      return {
        ...state
      }

    case AuthActions.LOGIN_EMPLOYEE_SUCCESS:
      return {
        ...state
      }

    case AuthActions.LOGIN_EMPLOYEE_ERROR:
      return {
        ...state
      }

    default:
      return state;
  }
}
