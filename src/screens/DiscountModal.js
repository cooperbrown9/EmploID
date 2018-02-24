import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';

import RoundButton from '../ui-elements/round-button';

class DiscountModal extends Component {

  static navigationOptions = {
    header: null
  }

  static propTypes = {
    dismiss: PropTypes.func,
    discount: PropTypes.object
  }

  constructor() {
    super();

    this.state = {
      red: 255,
      green: 0,
      blue: 0,
      colorIndex: 0
    }
  }

  componentDidMount() {
    // RED: 255, 0 , 0
    // ORANGE: 255, 127, 0
    // YELLOW: 255, 255, 0
    // GREEN: 0, 255, 0
    // BLUE: 0, 0, 255
    // PURPLE: 148, 0, 211
    setInterval(() => {

      switch(this.state.colorIndex) {
        case 0: // RED to ORANGE
          if(this.state.green === 127) {
            this.setState({ colorIndex: 1 })
          } else {
            this.setState({ green: ++this.state.green });
          }
          break;

        case 1: // ORANGE to YELLOW
          if(this.state.green === 255) {
            this.setState({ colorIndex: 2 });
          } else {
            this.setState({ green: ++this.state.green });
          }
          break;

        case 2: // YELLOW to GREEN
          if(this.state.red === 0) {
            this.setState({ colorIndex: 3 });
          } else {
            this.setState({ red: --this.state.red });
          }
          break;

        case 3: // GREEN to BLUE
          if(this.state.blue === 255) {
            this.setState({ green: --this.state.green });
            if(this.state.green === 1) {
              this.setState({ colorIndex: 4 })
            }
          } else {
            this.setState({ blue: ++this.state.blue })
          }
          break;

        

        default:
          console.log('yuh');
          break;
      }
      // this.setState({ red: ++this.state.red, green: ++this.state.green, blue: ++this.state.blue });
    }, 10);
  }

  makeColor() {
    return 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')';
  }

  render() {
    return(
      <View style={styles.container} backgroundColor={'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')'}>
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.dismiss()} imagePath={require('../../assets/icons/back.png')}/>
        </View>



      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backButton: {
    position: 'absolute', left: 20, top: 20,
    zIndex: 1001
  },
});

export default DiscountModal;
