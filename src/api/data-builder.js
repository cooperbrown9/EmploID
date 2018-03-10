
export function buildEmployeeForm(data, callback) {
  var obj = {
    "firstName": data.firstName,
    "lastName": data.lastName,
    "email": data.email,
    "places": data.places,
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
