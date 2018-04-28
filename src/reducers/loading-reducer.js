
import * as LoadingActions from '../action-types/loading-action-types.js';
const initialState = { isLoading: false, needReload: false, screenDepthReloaded: 0 }

export default function loading(state = initialState, action) {
  switch(action.type) {
    case LoadingActions.START_LOADING:
      return {
        ...state,
        isLoading: true,
        needReload: true
      }

    case LoadingActions.STOP_LOADING:
      return {
        ...state,
        isLoading: false,
        needReload: action.needReload
      }

    case LoadingActions.RELOAD_COMPLETE:
      return {
        ...state,
        isLoading: false,
        needReload: false
      }

    default:
      return state;
  }
}
