
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
  place.positions.forEach((position, index) => {
    if(place.relation.position === position) {
      place.positions[index] = { value: place.relation.position, selected: true, index: index };
    } else {
      place.positions[index] = { value: position, selected: false, index: index };
    }
  });
  callback(place);
}
