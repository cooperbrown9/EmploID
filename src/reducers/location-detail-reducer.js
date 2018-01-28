
import * as LocDetailActions from '../action-types/location-detail-action-types';

const initialState = { location: {}, employees: [], discounts: [] }

export default function locationDetail(state = initialState, action) {

  switch(action.type) {
    case LocDetailActions.SET_LOCATION:
      return {
        ...state,
        location: action.location
      }

    case LocDetailActions.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.employees
      }

    case LocDetailActions.SET_DISCOUNTS:
      return {
        ...state,
        discounts: action.discounts
      }

    default:
      return state;
  }
}
