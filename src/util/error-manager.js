
// TODO pass dispatcher to this function, then STOP_LOADING could be managed
// from this thing also

// 408 - invalid email
// 401 - duplicate email
export function handleCreateError(status, callback) {
  switch(status) {
    case 408:
      callback('You must use a valid email!');
      break;

    case 401:
      callback('This email is already in use!');
      break;

    default:
      callback('Error creating User at this time');
      break;
  }
}
