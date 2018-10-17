
export function assignPositionsToEmployees(myPlaces, employeePlaces, callback) {

}

export function findSimilarPlaces(myPlaces, employeePlaces) {
  // debugger;
  let similarPlaces = myPlaces.filter((myPlace, myIndex) => {

  })
}

export function findSelectedPositions(place, positionOptions, callback) {
  for(let i = 0; i < place.positions.length; i++) {
    for(let j = 0; j < positionOptions.length; j++) {
      if(place.positions[i] === positionOptions[j].value) {
        callback(positionOptions[j].index);
        // this.positionSelected(this.state.positionOptions[j].index);
      }
    }
  }
}


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

export function checkPermissionForEmployeeEdit(myPlaces, empPlaces, callback) {
  for(let i = 0; i < empPlaces.length; i++) {
    for(let j = 0; j < myPlaces.length; j++) {
      // if Im on my own profile, send back role
      if(empPlaces[i].relation.user_id === myPlaces[j].relation.user_id) {
        callback(empPlaces[i].relation.role);
        return;
      }
    }
  }

  let similarPlaces = [];
  for(let i = 0; i < empPlaces.length; i++) {
    for(let j = 0; j < myPlaces.length; j++) {
      if(empPlaces[i]._id === myPlaces[j]._id) {
        similarPlaces.push({ employeePlace: empPlaces[i], myPlace: myPlaces[j] });
      }
    }
  }
  let highestRole = 0;
  for(let i = 0; i < similarPlaces.length; i++) {
    if(similarPlaces[i].myPlace.relation.role > similarPlaces[i].employeePlace.relation.role) {
      if(similarPlaces[i].myPlace.relation.role > highestRole) {
        highestRole = similarPlaces[i].myPlace.relation.role;
      }
    }
  }
  callback(highestRole);
}

// discounts are all of those from the employee
// this is called after relations are assigned to the discounts
export function sortDiscountPermissions(discounts, myPlaces, callback) {
  let validDiscounts = [];
  for(let i = 0; i < discounts.length; i++) {
    for(let j = 0; j < myPlaces.length; j++) {
      if(discounts[i].place_id === myPlaces[j]._id) {
        // if exclusive, check rank, otherwise add it outright
        if(discounts[i].exclusive) {
          // if MY role for this place is 1 or 2, then Im management
          if(myPlaces[j].relation.role >= 1) {
            validDiscounts.push(discounts[i]);
          }
        } else {
          validDiscounts.push(discounts[i]);
        }
      }
    }
  }
  callback(validDiscounts);
}

export function getMyRankToEmployeeByPlaces(myPlaces, employeePlaces, callback) {
  // find the location both me and employee work at.
  // for each of our alike places, find my highest rank
  let samePlaces = [];
  myPlaces.forEach((myPlace) => {
    employeePlaces.forEach((empPlace) => {
      if(myPlace._id === empPlace._id) {
        samePlaces.push({ myPlace: myPlace, employeePlace: empPlace });
      }
    })
  });

  let highestRank = 0;
  for(let i = 0; i < samePlaces.length; i++) {
    if(samePlaces[i].myPlace.relation.role > samePlaces[i].employeePlace.relation.role) {
      if(samePlaces[i].myPlace.relation.role > highestRank) {
        highestRank = samePlaces[i].myPlace.relation.role;
      }
    }
  }
  callback(highestRank);
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
    "positions": data.positions,
    "sessionID": data.sessionID,
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
