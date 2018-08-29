import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions } from 'expo';

import * as Colors from '../constants/colors';

class CameraScreen extends Component {

  constructor() {
    super();

  }

  static propTypes = {
    setRef: PropTypes.object,
    onCancel: PropTypes.func,
    onSnap: PropTypes.func
  }

  componentDidMount() {

  }

  render() {
    return(
      <View style={{position: 'absolute', left: 0, right: 0, top:0,bottom:0}}>
          <Camera ref={ref => this.props.setRef } type={Camera.Constants.Type.back} style={{flex: 1, justifyContent:'flex-end', alignItems:'stretch'}} >
            <View style={{height: 64, marginBottom:32, flexDirection: 'row', backgroundColor:'transparent', justifyContent:'space-around'}}>
              <TouchableOpacity onPress={this.props.onCancel} style={{height:64,width:128, borderRadius:16, backgroundColor:Colors.BLUE, justifyContent:'center',alignItems:'center'}} >
                <Image style={{height:32, width:32,tintColor:'white'}} source={require('../../assets/icons/cancel.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.props.onSnap} style={{height:64,width:128,borderRadius:16, backgroundColor:Colors.BLUE,justifyContent:'center',alignItems:'center' }} >
                <Image style={{height:32, width:32, tintColor:'white'}} source={require('../../assets/icons/camera.png')} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
    )
  }

}

export default Camera;
