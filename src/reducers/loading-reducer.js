
import * as LoadingActions from '../action-types/loading-action-types.js';
const initialState = { isLoading: false, needToReload: false, screenDepthReloaded: 0 }

export default function loading(state = initialState, action) {
  switch(action.type) {
    case LoadingActions.START_LOADING:
      return {
        ...state,
        isLoading: true,
        needToReload: true
      }

    case LoadingActions.STOP_LOADING:
      return {
        ...state,
        isLoading: false
      }

    case LoadingActions.RELOAD_COMPLETE:
      return {
        ...state,
        isLoading: false,
        needToReload: false
      }

    default:
      return state;
  }
}
