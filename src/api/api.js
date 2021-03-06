import axios from 'axios';
import * as ImageAPI from './image-handler';

const BASE = 'https://emploid.herokuapp.com/api';

const GET_USER = '/get-user/';
const GET_USERS = '/get-users';
// const GET_PLACES = '/get-places/';
const GET_PLACE = '/get-place/';
const GET_PLACES = '/get-places';
const GET_DISCOUNT = '/get-discount/';
const GET_DISCOUNTS_BY_PLACE = '/get-discounts-by-place/';
const GET_DISCOUNTS_BY_PLACES = '/get-discounts-by-places';

const GET_LOCATIONS_IN_GROUP = '/get-locations-in-group/';

const GET_USER_RELATIONS = '/get-relations-by-user/';
const GET_PLACE_RELATIONS = '/get-relations-by-place/';
const GET_RELATIONS = '/get-relations';
const GET_RELATIONS_BY_PLACES = '/get-relations-by-places';
const GET_USER_NOTES = '/get-user-notes/';
const GET_PLACE_NOTES = '/get-place-notes/';
const GET_USER_COUNT = '/get-user-count';

const CREATE_USER = '/create-user';
const CREATE_PLACE = '/create-place';
const CREATE_DISCOUNT = '/create-discount';
const CREATE_RELATION = '/create-relation';
const CREATE_RELATIONS = '/create-relations';
const CREATE_USER_NOTE = '/create-user-note';
const CREATE_PLACE_NOTE = '/create-place-note';

const UPDATE_USER = '/update-user';
const UPDATE_USER_IMAGE = '/update-user-image';
const UPDATE_LOCATION = '/update-place';
const UPDATE_DISCOUNT = '/update-discount';
const UPDATE_USER_PLACES = '/update-user-places';
const UPDATE_ROLE = '/update-role';
const UPDATE_PLACE_NOTE = '/update-place-note';
const UPDATE_USER_NOTE = '/update-user-note';

const DELETE_USER = '/delete-user';
const DELETE_RELATION = '/delete-relation';
const DELETE_RELATIONS = '/delete-relations';
const DELETE_DISCOUNT = '/delete-discount/';
const DELETE_PLACE_NOTE = '/delete-place-note';
const DELETE_USER_NOTE = '/delete-user-note';

const VERIFY_SESSION_GET_USER = '/verify-session-get-user';

const QUERY_WITH_PLACE = '/query-with-place';
const QUERY_BY_POSITION = '/query-by-position';
const QUERY_USERS_WITH_PLACE = '/query-users-with-place';

const LOGIN_USER = '/login';

const FORGOT_PASSWORD = '/forgot-password';

export function getUser(userID, callback) {
  axios.get(BASE + GET_USER + userID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getUsers(users, callback) {
  axios.post(BASE + GET_USERS, users)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlace(placeID, callback) {
  axios.get(BASE + GET_PLACE + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlaces(_places, callback) {
  axios.post(BASE + GET_PLACES, _places)
    .then(response => callback(null, response.data))
    .catch(e => callback(e));
}

// export function getPlaces(userID, callback) {
//   axios.get(BASE + GET_PLACES + userID)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }

export function createUser(data, callback) {
  axios.post(BASE + CREATE_USER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createRelation(data, callback) {
  axios.post(BASE + CREATE_RELATION, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createRelations(relations, callback) {
  axios.post(BASE + CREATE_RELATIONS, relations)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createUserNote(data, callback) {
  axios.post(BASE + CREATE_USER_NOTE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createPlaceNote(data, callback) {
  axios.post(BASE + CREATE_PLACE_NOTE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updatePlaceNote(data, callback) {
  axios.post(BASE + UPDATE_PLACE_NOTE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateUserNote(data, callback) {
  axios.post(BASE + UPDATE_USER_NOTE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getUserNotes(creatorID, employeeID, callback) {
  axios.get(BASE + GET_USER_NOTES + creatorID + '/' + employeeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getUserCount(placeID, callback) {
  axios.get(BASE + GET_USER_COUNT + '/' + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlaceNotes(creatorID, placeID, callback) {
  axios.get(BASE + GET_PLACE_NOTES + creatorID + '/' + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function login(data, callback) {
  axios.post(BASE + LOGIN_USER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function verifySession(data, callback) {
  axios.post(BASE + VERIFY_SESSION_GET_USER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createPlace(data, callback) {
  axios.post(BASE + CREATE_PLACE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getDiscount(discID, callback) {
  axios.get(BASE + GET_DISCOUNT + discID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getDiscountsByPlace(placeID, callback) {
  axios.get(BASE + GET_DISCOUNTS_BY_PLACE + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getDiscountsByPlaces(places, callback) {
  axios.post(BASE + GET_DISCOUNTS_BY_PLACES, places)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createDiscount(data, callback) {
  axios.post(BASE + CREATE_DISCOUNT, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateDiscount(discount, callback) {
  axios.post(BASE + UPDATE_DISCOUNT, discount)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateUser(data, callback) {
  axios.post(BASE + UPDATE_USER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateUserImage(data, callback) {
  axios.post(BASE + UPDATE_USER_IMAGE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateLocation(data, callback) {
  axios.post(BASE + UPDATE_LOCATION, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateRole(data, callback) {
  axios.post(BASE + UPDATE_ROLE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function updateUserPlaces(data, callback) {
  axios.post(BASE + UPDATE_USER_PLACES, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getLocationsInGroup(groupID, callback) {
  axios.get(BASE + GET_LOCATIONS_IN_GROUP + groupID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getRelationsByUser(userID, callback) {
  axios.get(BASE + GET_USER_RELATIONS + userID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

// only finds 1 place
export function getRelationsByPlace(placeID, callback) {
  axios.get(BASE + GET_PLACE_RELATIONS + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

// finds an array of places
export function getRelationsByPlaces(places, callback) {
  axios.post(BASE + GET_RELATIONS_BY_PLACES, places)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getRelations(relations, callback) {
  axios.post(BASE + GET_RELATIONS, relations)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function deleteUser(userID, callback) {
  axios.post(BASE + DELETE_USER, userID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function deleteRelation(id, callback) {
  axios.post(BASE + DELETE_RELATION, id)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function deleteRelations(relations, callback) {
  axios.post(BASE + DELETE_RELATIONS, relations)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function deleteDiscount(discountID, callback) {
  axios.get(BASE + DELETE_DISCOUNT + discountID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

// needs object with _id set to note's _id
export function deletePlaceNote(id, callback) {
  let sender = {
    '_id': id
  }

  axios.post(BASE + DELETE_PLACE_NOTE, sender)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function deleteUserNote(id, callback) {
  let sender = {
    '_id': id
  }

  axios.post(BASE + DELETE_USER_NOTE, sender)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function queryWithPlace(data, callback) {
  axios.post(BASE + QUERY_WITH_PLACE, data)
    .then(resposne => callback(null, response.data))
    .catch(e => callback(e))
}

export function queryByPosition(data, callback) {
  axios.post(BASE + QUERY_BY_POSITION, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function queryUsersWithPlace(data, callback) {
  axios.post(BASE + QUERY_USERS_WITH_PLACE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function resetPassword(email, callback) {
  axios.post(BASE + FORGOT_PASSWORD, email)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

// --------------------- IMAGES ----------------------
export function uploadImage(img, callback) {
  ImageAPI.uploadImage(img, callback);
}
// ---------------------- END IMAGES ----------------------




// -------------------- OLD API --------------------
// const LOGIN_OWNER = '/login-owner';
//
//
// // needs ownerID param
// const GET_OWNER = '/get-owner/';
// const VERIFY_OWNER = '/verify-session-owner';
// const VERIFY_SESSION_GET_OWNER = '/verify-session-get-owner';
//
// const CREATE_EMPLOYEE = '/create-employee';
// const GET_EMPLOYEE = '/get-employee/';
// const LOGIN_EMPLOYEE = '/login-employee';
//
// // const CREATE_PLACE = '/create-place';
// const GET_PLACE = '/get-place/';
// const GET_PLACES_FROM_OWNER = '/get-places-from-owner';
// const GET_PLACES_AND_EMPLOYEES = '/get-places-and-employees';
// const GET_PLACES_FROM_EMPLOYEE = '/get-places-from-employee';
//
// // const GET_DISCOUNT = '/get-discount/';
// const CREATE_DISCOUNT = '/create-discount';
//
// const UPDATE_LOCATION = '/update-place';
//
// const UPDATE_EMPLOYEE = '/update-employee';
// const UPDATE_EMPLOYEE_PLACES = '/update-employee-places';
//
//
// // EMPLOYEE FUNCTIONS
// export function createEmployee(data, callback) {
//   axios.post(BASE + CREATE_EMPLOYEE, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function loginEmployee(data, callback) {
//   axios.post(BASE + LOGIN_EMPLOYEE, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
//
// export function getEmployee(employeeID, callback) {
//   axios.get(BASE + GET_EMPLOYEE + employeeID)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function updateEmployee(employee, callback) {
//   axios.post(BASE + UPDATE_EMPLOYEE, employee)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function updateEmployeePlaces(employee, callback) {
//   axios.post(BASE + UPDATE_EMPLOYEE_PLACES, employee)
//     .then(response => callback(null, response))
//     .catch(e => callback(e))
// }
//
// export function getPlacesFromEmployee(employeeID, callback) {
//   axios.get(BASE + GET_PLACES_FROM_EMPLOYEE + employeeID)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
//
// // OWNER FUNCTIONS
// export function loginOwner(data, callback) {
//   axios.post(BASE + LOGIN_OWNER, data)
//   .then(response => callback(null, response.data))
//   .catch(e => callback(e))
// }
//
// export function verifySessionGetOwner(data, callback) {
//   axios.post(BASE + VERIFY_SESSION_GET_OWNER, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
//
// export function getOwner(ownerID, callback) {
//   axios.get(BASE + GET_OWNER + ownerID)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// // export function createPlace(data, callback) {
// //   axios.post(BASE + CREATE_PLACE, data)
// //     .then(response => callback(null, response.data))
// //     .catch(e => callback(e))
// // }
//
// export function getPlace(placeID, callback) {
//   axios.get(BASE + GET_PLACE + placeID)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function updateLocation(data, callback) {
//   axios.post(BASE + UPDATE_LOCATION, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function getPlacesFromOwner(data, callback) {
//   axios.post(BASE + GET_PLACES_FROM_OWNER, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// export function getPlacesAndEmployees(data, callback) {
//   axios.post(BASE + GET_PLACES_AND_EMPLOYEES, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
// // export function getDiscount(discountID, callback) {
// //   axios.get(BASE + GET_DISCOUNT + discountID)
// //     .then(response => callback(null, response.data))
// //     .catch(e => callback(e))
// // }
//
// export function createDiscount(data, callback) {
//   axios.post(BASE + CREATE_DISCOUNT, data)
//     .then(response => callback(null, response.data))
//     .catch(e => callback(e))
// }
//
//
// export function loadEmployees(employees, callback) {
//   let employeeCount = 0;
//   let _employees = [];
//   for(let i = 0; i < employees.length; i++) {
//     API.getEmployee(employees[i].employee_id, (err, emp) => {
//       if(err) {
//         Alert.alert(err.message);
//       } else {
//         employeeCount++;
//         _employees.push(emp);
//         console.log(emp);
//
//         if(employeeCount === employees.length) {
//           console.log(_employees);
//           callback(null, _employees);
//           // this.setState({ employees: _employees });
//         }
//       }
//     })
//   }
// }
