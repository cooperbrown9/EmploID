import * as RestaurantActions from '../action-types/restaurant-profile-action-types';

const ON_EMPLOYEES = 0;
const ON_DISCOUNTS = 1;
const ON_NOTES = 2;

const initialState = {
  indexOn: ON_EMPLOYEES,
  editOpen: false,
  restaurantID: false

};

export default function restaurant(state = initialState, action) {
  switch(action.type) {
    case RestaurantActions.OPEN_EMPLOYEES:
      return {
        ...state,
        indexOn: ON_EMPLOYEES
      }

    case RestaurantActions.OPEN_DISCOUNTS:
      return {
        ...state,
        indexOn: ON_DISCOUNTS
      }

    case RestaurantActions.OPEN_NOTES:
      return {
        ...state,
        indexOn: ON_NOTES
      }

    case RestaurantActions.EDIT_PROFILE:
      return {
        ...state,
        editOpen: true
      }

    case RestaurantActions.SET_RESTAURANT_ID:
      return {
        ...state,
        locationID: action.locationID

      }

    default:
      return state;

  }
}
