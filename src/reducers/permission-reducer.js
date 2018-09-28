
import * as PermissionActions from '../action-types/permission-action-types';

const initialState = {
  isUserCreator: false,
  isPlaceCreator: false,

  // array of either places or placeIDs
  isManagerAt: []
}

export default function permission(state=initialState, action) {
  switch(action.type) {
    case PermissionActions.SET_IS_USER_CREATOR:
      return {
        ...state,
        isUserCreator: action.isCreator
      }

    case PermissionActions.SET_IS_PLACE_CREATOR:
      if(action.isCreator === 2) {
        action.isCreator = true;
      } else {
        action.isCreator = false;
      }
      return {
        ...state,
        isPlaceCreator: action.isCreator
      }

    case PermissionActions.SET_PLACES_I_AM_MANAGER:
      return {
        ...state,
        isManagerAt: action.places
      }

    default:
      return state;
  }
}
