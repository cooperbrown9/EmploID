import { combineReducers } from 'redux';
import NavigationReducer from './navigation-reducer';
import nav from './navigation-reducer';
import tab from './tab-reducer';
import user from './user-reducer';
import setup from './setup-reducer';
import employeeTab from './employee-tab-reducer';
import employeeDetail from './employee-detail-reducer';
// import rest from './restaurant-profile-reducer';
import locationDetail from './location-detail-reducer';
import locationTab from './location-tab-reducer';
import loading from './loading-reducer';
import detail from './detail-reducer';
export default MainReducer = combineReducers({
  nav,
  tab,
  user,
  setup,
  employeeTab,
  employeeDetail,
  locationDetail,
  locationTab,
  loading,
  detail
});
