
export function buildEmployeeForm(data, callback) {
  var obj = {
    "name": data.name,
    "email": data.email,
    "position": data.position,
    "phone": data.phone,
    "gender": data.gender,
    "hair": data.hairColor,
    "sessionID": data.sessionID,
    "ownerID": data.ownerID
  }

  callback(obj);
}
