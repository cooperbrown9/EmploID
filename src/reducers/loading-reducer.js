
import * as LoadingActions from '../action-types/loading-action-types.js';
const initialState = { isLoading: false }

export default function loading(state = initialState, action) {
  switch(action.type) {
    case LoadingActions.START_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case LoadingActions.STOP_LOADING:
      return {
        ...state,
        isLoading: false
      }

    default:
      return state;
  }
}
