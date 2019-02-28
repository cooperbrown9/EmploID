import React, { Component } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';

import { BACKGROUND_GREY } from '../constants/colors';

class ProgressiveImage extends Component {
  constructor() {
    super()
  }

  thumbnailAnimated = new Animated.Value(0)
  imageAnimated = new Animated.Value(0)

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  }
  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  }

  render() {
    const {
      thumbnailSource,
      source,
      style,
      ...props
    } = this.props;
    style.overflow = 'hidden';
    return(
      <View style={styles.container} >
        <Animated.Image
          {...this.props}
          source={thumbnailSource}
          style={[style, { opacity: this.thumbnailAnimated, overflow: 'hidden' }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={2}
        />
      <Animated.Image
          {...this.props}
          source={source}
          style={[styles.imageOverlay, , { opacity: this.imageAnimated, overflow:'hidden' }, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_GREY,
    overflow: 'hidden',
    borderBottomLeftRadius: 4, borderTopLeftRadius: 4
  },
  imageOverlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    overflow: 'hidden'
  }
})

export default ProgressiveImage;
