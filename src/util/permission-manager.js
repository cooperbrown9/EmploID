
export function assignPositionsToUser (places, userPlaces, callback) {
  places.forEach(place => {
    place.positions.forEach((position, index) => {
      place.positions[index] = { value: position, selected: false, index: index }

      userPlaces.forEach(userPlace => {
        if(userPlace._id === place._id) {
          place.positions.forEach((position,index) => {
            if(position.value === userPlace.relation.position) {
              place.positions[index].selected = true;
            }
          })
        }
      })
    })
  });
  callback(places);
}

export function assignSinglePlacePositionToUser (place, callback) {
  for(let i = 0; i < place.positions.length; i++) {
    place.positions[i] = { value: place.positions[i], selected: false, index: i }
  }

  for(let o = 0; o < place.positions.length; o++) {
    for(let i = 0; i < place.relation.positions.length; i++) {
      if(place.relation.positions[i] == place.positions[o].value) {
        place.positions[o].selected = true;
      }
    }
  }
  callback(place);
}
