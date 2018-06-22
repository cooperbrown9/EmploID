import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';

import { BACKGROUND_GREY } from '../constants/colors';
import RoundButton from '../ui-elements/round-button';

export default class ImageScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  static propTypes = {
    image: PropTypes.string,
    dismiss: PropTypes.func
  }

  componentDidMount() {
    if(!this.props.image) {
    }
  }


  render() {
    return(
      <View style={styles.container} >
        <View style={styles.backButton} >
          <RoundButton imagePath={require('../../assets/icons/down.png')} onPress={this.props.dismiss} />
        </View>
        <Image resizeMode={'contain'} style={styles.image} source={{uri:this.props.image}} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_GREY
  },
  backButton: {
    position: 'absolute', left: 20, top: 32,
    zIndex: 1001
  },
  image: {
    flex: 1
  }
})
