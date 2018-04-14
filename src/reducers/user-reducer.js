import * as UserActions from '../action-types/auth-action-types';

const initialState = {
  isLoggedIn: false, isOwner : true,
  sessionID: null, userID: null,
  myEmployees: [], myLocations: [], myDiscounts: [],
  myLocationRelations: [],
  role: null
};

export default function user (state = initialState, action) {
  switch(action.type) {

    case UserActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.user,
        sessionID: action.sessionID,
        userID: action.userID,
        role: action.role
      }

    case UserActions.LOGIN_ERROR:
      return {
        ...state
      }

    // case UserActions.LOGIN_OWNER_SUCCESS:
    //   return {
    //     ...state,
    //     isLoggedIn: true,
    //     isOwner: true,
    //     user: action.user,
    //     sessionID: action.sessionID,
    //     userID: action.userID
    //   }

    // case UserActions.LOGIN_OWNER_ERROR:
    //   return {
    //     ...state,
    //     isLoggedIn: false,
    //     isOwner: false
    //   }
    //
    // case UserActions.LOGIN_EMPLOYEE_SUCCESS:
    //   return {
    //     ...state,
    //     isLoggedIn: true,
    //     isOwner: false,
    //     user: action.user,
    //     userID: action.userID
    //   }

    // case UserActions.LOGIN_EMPLOYEE_ERROR:
    //   return {
    //     ...state,
    //     isLoggedIn: false,
    //     isOwner: false
    //   }

    case UserActions.SET_EMPLOYEES:
      return {
        ...state,
        myEmployees: action.employees
      }

    case UserActions.SET_LOCATIONS:
      return {
        ...state,
        myLocations: action.locations
      }

    case UserActions.SET_DISCOUNTS:
      return {
        ...state,
        myDiscounts: action.discounts
      }

    default:
      return state;
  }
}
