import axios from 'axios';

const BASE = 'https://emploid.herokuapp.com/api';

const LOGIN_OWNER = '/login-owner';

// needs ownerID param
const GET_OWNER = '/get-owner/';
const VERIFY_OWNER = '/verify-session-owner';

const CREATE_EMPLOYEE = '/create-employee';


export function createEmployee(data, callback) {
  axios.post(BASE + CREATE_EMPLOYEE, data)
    .then(response => callback(response.data))
    .catch(e => callback(e))
}

export function loginEmployee(data, callback) {

}

export function lol(val) {
  val = 10;
}


export function loginOwner(data, callback) {
  axios.post(BASE + LOGIN_OWNER, data)
  .then(response => callback(null, response.data))
  .catch(e => callback(e))
}

export function verifySessionOwner(data, dispatch) {
  // return dispatch => {
  //   dispatch({ type: ''})
  // }

  axios.post(BASE + VERIFY_OWNER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getOwner(ownerID, callback) {
  axios.get(BASE + GET_OWNER + ownerID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}
