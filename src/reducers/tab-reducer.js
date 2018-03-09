
import * as TabActions from '../action-types/tab-action-types';

const initialState = { index: 0 };

export default function tab(state = initialState, action) {
  switch(action.type) {

    case TabActions.LOCATION_TAB:
      return {
        ...state,
        index: 0
      }

    case TabActions.EMPLOYEE_TAB:
      return {
        ...state,
        index: 1
      }

    default:
      return state;
  }
}
