import * as UserActions from '../action-types/auth-action-types';
import { alphabetizeUsers, alphabetizePlaces } from '../util';


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

    // COMBAK if there's anything weird, check this out because maybe Im using
    // current user off the employees array for something, so taking it out is
    // causing it to break
    case UserActions.SET_EMPLOYEES:
      let cleanEmployees = [];
      for(let i = 0; i < action.employees.length; i++) {
        if(action.employees[i]._id !== state.userID) {
          cleanEmployees.push(action.employees[i]);
        }
      }

      cleanEmployees = alphabetizeUsers(cleanEmployees);

      return {
        ...state,
        myEmployees: cleanEmployees//action.employees
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

    // this was put in literally just to handle updating the canCreateEmployees
    // functionality, this will change eventually
    case UserActions.UPDATE_USER_CAN_CREATE:
      return {
        ...state,
        canCreateUsers: action.canCreate
      }

    default:
      return state;
  }
}
