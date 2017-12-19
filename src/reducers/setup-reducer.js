
import * as SetupActions from '../action-types/setup-action-types';

const initialState = { fontLoaded: false };

export default function setup (state = initialState, action) {
  switch(action.type) {
    case SetupActions.FONT_LOADED:
      return {
        ...state,
        fontLoaded: true
      }

    default:
      return state;
  }
}
