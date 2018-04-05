
import axios from 'axios';

const BASE = 'https://emploid.herokuapp.com';

const UPLOAD = '/upload';
const DOWNLOAD = ''


export function uploadImage(img, callback) {
  axios.post(BASE + UPLOAD, img)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}
