import call from 'react-native-phone-call';


export function callPhoneNumber(num) {
  const args = {
    number: num,
    prompt: true
  }
  call(args).catch(console.error);
}


export function toPhoneNumber(num) {
  let number = '(';
  number += num.slice(0,3);
  number += ')';
  number += num.slice(3,6);
  number += '-';
  number += num.slice(6,10);
  return number;
}
