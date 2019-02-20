
import axios from 'axios';
import * as DataBuilder from './data-builder';
import * as API from './api';

const BASE = 'https://emploid.herokuapp.com';

const UPLOAD = '/upload';
const DOWNLOAD = ''


export function uploadImage(img, callback) {
  axios.post(BASE + UPLOAD, img)
    .then(response => callback(null, response.data))
    .catch(e => callback(e))
}
//
// export function uploadPlace(myID, data, callback) {
//   DataBuilder.buildPlaceForm(data, (obj) => {
//     API.createPlace(obj, (err, place) => {
//       if(err) {
//         callback(err)
//       } else {
//         // Alert.alert('Success!');
//
//         const relationData = {
//           'placeID': place._id,
//           'userID': myID,//this.props.me._id,
//           'role': 2
//         }
//         API.createRelation(relationData, (err, relation) => {
//           if(err) {
//             callback(err)
//           } else {
//             // console.log(relation);
//             // callback(null, relation)
//             // UPDATE OWNER SO YOU CAN GET FRESH EMPLOYEE ARRAY
//             this.refreshUser(data, () => {
//               this.getPlaces();
//             });
//           }
//         });
//       }
//     });
//   });
// }
