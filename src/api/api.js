import axios from 'axios';

const BASE = 'https://emploid.herokuapp.com/api';

const LOGIN_OWNER = '/login-owner';


// needs ownerID param
const GET_OWNER = '/get-owner/';
const VERIFY_OWNER = '/verify-session-owner';
const VERIFY_SESSION_GET_OWNER = '/verify-session-get-owner';

const CREATE_EMPLOYEE = '/create-employee';
const GET_EMPLOYEE = '/get-employee/';
const LOGIN_EMPLOYEE = '/login-employee';

const CREATE_PLACE = '/create-place';
const GET_PLACE = '/get-place/';
const GET_PLACES_FROM_OWNER = '/get-places-from-owner';
const GET_PLACES_AND_EMPLOYEES = '/get-places-and-employees';
const GET_PLACES_FROM_EMPLOYEE = '/get-places-from-employee/';
const GET_EMPLOYEES_FROM_PLACE = '/get-employees-from-place/';



// EMPLOYEE FUNCTIONS
export function createEmployee(data, callback) {
  axios.post(BASE + CREATE_EMPLOYEE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function loginEmployee(data, callback) {
  axios.post(BASE + LOGIN_EMPLOYEE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}


export function getEmployee(employeeID, callback) {
  axios.get(BASE + GET_EMPLOYEE + employeeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlacesFromEmployee(employeeID, callback) {
  axios.get(BASE + GET_PLACES_FROM_EMPLOYEE + employeeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}


// OWNER FUNCTIONS
export function loginOwner(data, callback) {
  axios.post(BASE + LOGIN_OWNER, data)
  .then(response => callback(null, response.data))
  .catch(e => callback(e))
}

export function verifySessionGetOwner(data, callback) {
  axios.post(BASE + VERIFY_SESSION_GET_OWNER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}


export function getOwner(ownerID, callback) {
  axios.get(BASE + GET_OWNER + ownerID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function createPlace(data, callback) {
  axios.post(BASE + CREATE_PLACE, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getEmployeesFromPlace(placeID, callback) {
  axios.get(BASE + GET_EMPLOYEES_FROM_PLACE + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlace(placeID, callback) {
  axios.get(BASE + GET_PLACE + placeID)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlacesFromOwner(data, callback) {
  axios.post(BASE + GET_PLACES_FROM_OWNER, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}

export function getPlacesAndEmployees(data, callback) {
  axios.post(BASE + GET_PLACES_AND_EMPLOYEES, data)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}
