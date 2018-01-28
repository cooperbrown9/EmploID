
import * as LocationTabActions from '../action-types/location-profile-action-types'

const EMPLOYEE_TAB_INDEX = 0;
const DISCOUNT_TAB_INDEX = 1;
const NOTE_TAB_INDEX = 2;

const initialState = { indexOn: EMPLOYEE_TAB_INDEX }

export default function locationTab(state = initialState, action) {
  switch(action.type) {
    case LocationTabActions.OPEN_EMPLOYEES:
      return {
        ...state,
        indexOn: EMPLOYEE_TAB_INDEX
      }

    case LocationTabActions.OPEN_DISCOUNTS:
      return {
        ...state,
        indexOn: DISCOUNT_TAB_INDEX
      }

    case LocationTabActions.OPEN_NOTES:
      return {
        ...state,
        indexOn: NOTE_TAB_INDEX
      }

    default:
      return state;
  }
}
