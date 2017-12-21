import axios from 'axios';

const BASE = 'https://emploid.herokuapp.com/api';

export function createEmployee(data, callback) {
  axios.post(BASE + '/create-employee', data)
    .then(response => callback(response.data))
    .catch(e => callback(e))
}
