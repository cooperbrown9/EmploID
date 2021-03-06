import { combineReducers } from 'redux';
import NavigationReducer from './navigation-reducer';
import nav from './navigation-reducer';
import tab from './tab-reducer';
import user from './user-reducer';
import setup from './setup-reducer';
import employeeTab from './employee-tab-reducer';
import locationTab from './location-tab-reducer';
import loading from './loading-reducer';
import detail from './detail-reducer';
import spotlight from './spotlight-reducer';
import permission from './permission-reducer';
import imageCache from './image-cache-reducer';

export default MainReducer = combineReducers({
  nav,
  tab,
  user,
  setup,
  employeeTab,
  locationTab,
  loading,
  detail,
  spotlight,
  permission,
  imageCache
});
