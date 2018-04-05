import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo';
import call from 'react-native-phone-call';


export function callPhoneNumber(num) {
  const args = {
    number: num,
    prompt: true
  }
  call(args).catch(console.error);
}

export function renderCamera(isOpen, takePicture, camera) {
    let CAM = new Camera(camera);
    // CAM.ref = camera.ref;
    // CAM.type = camera.type;
    // CAM.style = camera.style;

    // debugger;
    if(isOpen) {
      return (
        <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
          { camera



          }
            <TouchableOpacity onPress={takePicture} style={{ marginBottom: 64 }} >
              <Image style={{height:32, width:32}} source={require('../assets/icons/camera.png')} />
            </TouchableOpacity>

        </View>
      )
    } else {
      return null;
    }
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
