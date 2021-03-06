import * as EmpActions from '../action-types/employee-profile-action-types';

const ON_PROFILE = 0;
const ON_LOCATIONS = 1;
const ON_DISCOUNTS = 2;
const ON_NOTES = 3;

const initialState = {
  employeeID: null,
  employee: null,
  indexOn: ON_PROFILE,
  editOpen: false

};

export default function employeeTab(state = initialState, action) {
  switch(action.type) {
    case EmpActions.OPEN_PROFILE_INFO:
      return {
        ...state,
        indexOn: ON_PROFILE
      }

    case EmpActions.OPEN_LOCATIONS:
      return {
        ...state,
        indexOn: ON_LOCATIONS
      }

    case EmpActions.OPEN_DISCOUNTS:
      return {
        ...state,
        indexOn: ON_DISCOUNTS
      }

    case EmpActions.OPEN_NOTES:
      return {
        ...state,
        indexOn: ON_NOTES
      }

    case EmpActions.EDIT_PROFILE:
      return {
        ...state,
        editOpen: true
      }

    case EmpActions.RESET:
      return initialState;

    case EmpActions.GET_EMPLOYEE_ID:
      return {
        ...state,
        employeeID: action.employeeID
      }

    default:
      return state;

  }
}
