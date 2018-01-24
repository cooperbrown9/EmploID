
import * as EmployeeDetailActions from '../action-types/employee-detail-action-types';
const initialState = { employee: null, places: [] }

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


    default:
      return state;
  }
}
