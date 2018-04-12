
export function assignRelationsToPlaces(relations, places, callback) {
  for(let i = 0; i < places.length; i++) {
    for(let j = 0; j < relations.length; j++) {
      if(places[i]._id === relations[j].place_id) {
        places[i].relation = relations[j];
        break;
      }
    }
  }
  callback(places);
}

export function assignRelationsToUsers(relations, users, callback) {
  for(let i = 0; i < users.length; i++) {
    for(let j = 0; j < relations.length; j++) {
      if(users[i]._id === relations[j].user_id) {
        users[i].relation = relations[j];
        break;
      }
    }
  }
  callback(users);
}

// pass in an employee's places, then it will check their relations at
// restaurants respective of the discount and assign role accordingly
export function assignRolesToDiscounts(places, discounts, callback) {
  for(let i = 0; i < discounts.length; i++) {
    for(let j = 0; j < places.length; j++) {

      if(discounts[i].place_id === places[j]._id) {
        discounts[i].location = places[j].name;

        if(discounts[i].exclusive && (places[j].relation.role !== 2 && places[j].relation.role !== 1)) {
          discounts.splice(i, 1);
          i--;
        }
      }
    }
  }
  callback(discounts);
}

export function buildEmployeeForm(data, callback) {
  var obj = {
    "firstName": data.firstName,
    "lastName": data.lastName,
    "email": data.email,
    "position": data.position,
    "imageURL": data.imageURL,
    "phone": data.phone,
    "gender": data.gender,
    "role": data.role,
    "hair": data.hairColor,
    "birthday": data.birthday,
    "hireDate": data.hireDate,
    "sessionID": data.sessionID,
    "userID": data.userID,
    "groupID": data.groupID
  }

  callback(obj);
}

export function buildPlaceForm(data, callback) {
  var obj = {
    "name": data.name,
    "address": data.address,
    "email": data.email,
    "imageURL": data.imageURL,
    "phone": data.phone,
    "sessionID": data.sessionID,
    "userID": data.userID,
    "groupID": data.groupID
  }

  callback(obj);
}

export function buildUpdateEmployeeForm(data, callback) {
  var obj = {
    "name": data.name,
    "email": data.email,
    "places": data.places,
    "position": data.position,
    "phone": data.phone,
    "gender": data.gender,
    "hair": data.hairColor,
    "birthday": data.birthday,
    "hireDate": data.hireDate
  }

  callback(obj);
}
