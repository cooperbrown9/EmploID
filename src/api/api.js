import axios from 'axios';

const BASE = 'https://emploid.herokuapp.com/api';

const LOGIN_OWNER = '/login-owner';

const CREATE_EMPLOYEE = '/create-employee';



export function createEmployee(data, callback) {
  axios.post(BASE + CREATE_EMPLOYEE, data)
    .then(response => callback(response.data))
    .catch(e => callback(e))
}

export function loginOwner(data, callback) {
  axios.post(BASE + LOGIN_OWNER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function loginEmployee(data, callback) {

}
