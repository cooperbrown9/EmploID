
const initialState = { loggedIn : false };

export default function user (state = initialState, action) {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state
      }

    default:
      return state;
  }
}
