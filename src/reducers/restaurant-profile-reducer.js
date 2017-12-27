import * as EmpActions from '../action-types/employee-profile-action-types';

const ON_EMPLOYEES = 1;
const ON_DISCOUNTS = 2;
const ON_NOTES = 3;

const initialState = {
  indexOn: ON_EMPLOYEES,
  editOpen: false

};

export default function emp(state = initialState, action) {
  switch(action.type) {
    case EmpActions.OPEN_EMPLOYEES:
      return {
        ...state,
        indexOn: ON_EMPLOYEES
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

    default:
      return state;

  }
}
