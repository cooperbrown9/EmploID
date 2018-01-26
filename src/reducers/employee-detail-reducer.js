
import * as EmployeeDetailActions from '../action-types/employee-detail-action-types';
const initialState = { employee: null, locations: [], discounts: [], notes: [] }

export default function employeeDetail(state = initialState, action) {
  switch(action.type) {
    case EmployeeDetailActions.SET_EMPLOYEE:
      return {
        ...state,
        employee: action.employee
      }

      case EmployeeDetailActions.SET_LOCATIONS:
        return {
          ...state,
          locations: action.locations
        }

      case EmployeeDetailActions.SET_COWORKERS:
        return {
          ...state,
          coworkers: action.coworkers
        }

      case EmployeeDetailActions.SET_DISCOUNTS:
        return {
          ...state,
          discounts: action.discounts
        }


    default:
      return state;
  }
}
