
import * as DetailActions from '../action-types/detail-action-types';
import * as util from '../util';
import { connect } from 'react-redux';

const initialState = {
  location: {},
  employees: [], discounts: [], locations: [], notes: [],
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
        myRole: action.myRole
      }

    case DetailActions.SET_LOCATIONS:
      return {
        ...state,
        locations: util.alphabetizePlaces(action.locations)
      }

    case DetailActions.SET_EMPLOYEES:
        return {
          ...state,
          employees: util.alphabetizeUsers(action.employees)
        }

    case DetailActions.SET_DISCOUNTS:
      return {
        ...state,
        discounts: action.discounts
      }

    case DetailActions.SET_NOTES:
      return {
        ...state,
        notes: action.notes
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
