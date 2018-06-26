import call from 'react-native-phone-call';
import { TextInput } from 'react-native';
import * as Colors from './constants/colors';
import * as _ from 'lodash';

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
//
// export function textInputFactory(placeholder, onTextChange, value, canEdit = true, keyboard = 'default') {
//   return (
//     <TextInput
//       placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
//       selectionColor={Colors.BLUE} style={styles.input}
//       autoCorrect={false} autoCapitalize={false}
//       onChangeText={(text) => onTextChange(text)}
//       value={value}
//       editable={canEdit} keyboardType={keyboard} returnKeyType={'done'}
//     />
//   )
// }

export function alphabetizeUsers(users) {
  let sorted = _.sortBy(users, 'first_name');
  return sorted;
}

export function alphabetizePlaces(places) {
  let sorted = _.sortBy(places, 'name');
  return sorted;
}
