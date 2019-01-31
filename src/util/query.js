// NOTE this file is for preparing data from the FilterModal
//      so that it is properly packaged when it is sent to the server
//      So yeah, it's probably a bit janky because it is so specific

import * as _ from 'lodash';
import * as API from '../api/api';

export function query(data, callback) {
  // filter out duplicate IDs
  data.userIDs = _.uniqBy(data.userIDs, 'userID');

  // simplify the array to just the IDs, rather than the whole object
  data.userIDs = _.map(data.userIDs, (u) => {
    return u.userID;
  });

  queryWithLocation(data, callback);
}

// this header is misleading
function queryWithLocation(data, callback) {
  let sender = {
    'users': data.userIDs,
    'position': data.job,
    'placeID': data.location
  }

  API.queryUsersWithPlace(sender, (e1, relations) => {
    if(e1) {
      console.log(e1);
      callback(e1);
    } else {
      getUsersFromRelations(relations, (e2, users) => {
        if(e2) {
          callback(e2);
        } else {
          if(data.hair != null) {
            users = queryHair(users, data.hair);
          }
          if(data.gender != null) {
            users = queryGender(users, data.gender);
          }
          callback(null, users);
        }
      })
    }
  })
}

function queryLocations(array, locID, callback) {

}

function queryHair(array, hair) {
  return _.filter(array, (a) => {
    return a.hair == hair;
  });
}

function queryGender(array, gender) {
  return _.filter(array, (a) => {
    return a.gender == gender;
  });
}

function getUsersFromRelations(relations, callback) {
  let userIDs = _.map(relations, (r) => {
    return { 'userID': r.user_id }
  });

  const sender = {
    'users': userIDs
  }

  API.getUsers(sender, (err, users) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      callback(null, users);
    }
  })
}
