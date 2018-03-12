
import * as DetailActions from '../action-types/detail-action-types';
import { connect } from 'react-redux';

const initialState = {
  location: {},
  employees: [], discounts: [], locations: [],
  user: {
    places: []
  }
 }

function detail(state = initialState, action) {

  switch(action.type) {

    case DetailActions.SET_USER:
      return {
        ...state,
        user: action.user
      }

    case DetailActions.SET_LOCATION:
      return {
        ...state,
        location: action.location,
        employeeRole: action.role
      }

    case DetailActions.SET_LOCATIONS:
      return {
        ...state,
        locations: action.locations
      }

    case DetailActions.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.employees
      }

    case DetailActions.SET_DISCOUNTS:
      return {
        ...state,
        discounts: action.discounts
      }

    default:
      return state;
  }
}

var mapStateToProps = state => {
  return {

  }
}

// export default connect(mapStateToProps)(detail);
export default detail;
