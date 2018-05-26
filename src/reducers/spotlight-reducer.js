import * as SpotlightActions from '../action-types/spotlight-action-types';

const initialState = {
  isOn: false,
  users: null
}

export default function spotlight(state = initialState, action) {
  switch(action.type) {
    case SpotlightActions.SPOTLIGHT_ON:
      return {
        ...state,
        isOn: true,
        users: action.users
      }

    case SpotlightActions.SPOTLIGHT_OFF:
      return {
        ...state,
        isOn: false,
        users: null
      }

    default:
      return state;
  }
}
