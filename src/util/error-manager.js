
// TODO pass dispatcher to this function, then STOP_LOADING could be managed
// from this thing also

// 408 - invalid email
// 401 - duplicate email
export function handleCreateError(status, callback) {
  switch(status) {
    case 408:
      callback('It appears that this email is invalid!');
      break;

    case 401:
      callback('This email is already in use!');
      break;

    default:
      callback('Error creating User at this time');
      break;
  }
}

export function handleLoginError(status, callback) {
  switch(status) {
    case 401:
      callback('Invalid username or password');
      break;

    case 503:
      callback('Server is having trouble processing requests right now!')

    default:
      callback('');
  }
}
