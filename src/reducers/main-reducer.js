import { combineReducers } from 'redux';
import NavigationReducer from './navigation-reducer';
import nav from './navigation-reducer';
import tab from './tab-reducer';
import user from './user-reducer';

export default MainReducer = combineReducers({
  nav,
  tab,
  user
});
