import call from 'react-native-phone-call';


export function callPhoneNumber(num) {
  const args = {
    number: num,
    prompt: true
  }
  call(args).catch(console.error);
}

export function cleanPhoneNumber(num, callback) {
  for(let i = 0; i < 4; i++) {
    num = num.replace('(', '');
    num = num.replace(')', '');
    num = num.replace('.', '');
    num = num.replace('-', '');
    num = num.replace(' ', '');
  }
  if(callback != null) {
    callback(num);
  } else {
    return num;
  }
}

export function checkEmail(email, callback) {
  callback(email.includes('@'));
}

export function toPhoneNumber(num) {
  let number = '(';
  number += num.slice(0,3);
  number += ') ';
  number += num.slice(3,6);
  number += '-';
  number += num.slice(6,10);
  return number;
}
