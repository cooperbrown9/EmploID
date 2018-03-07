import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';

import RoundButton from '../ui-elements/round-button';
import SubmitButton from '../ui-elements/submit-button';

import { BACKGROUND_GREY } from '../constants/colors';

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
      colorIndex: 0,
      color: 'rgb(100,100,100)'// 'rgb(' + this.red, + ',' + this.green + ',' + this.blue +')'
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
            if(this.state.green === 0) {
              this.setState({ colorIndex: 4 })
            }
          } else {
            this.setState({ blue: ++this.state.blue })
          }
          break;

        case 4: // BLUE to PURPLE
          if(this.state.red === 148) {
            this.setState({ blue: --this.state.blue });
            if(this.state.blue === 211) {
              this.setState({ colorIndex: 5 });
            }
          } else {
            this.setState({ red: ++this.state.red });
          }

          case 5:
            if(this.state.blue === 0) {
              this.setState({ red: ++this.state.red });
              if(this.state.red === 255) {
                this.setState({ colorIndex: 0 });
              }
            } else {
              this.setState({ blue: --this.state.blue });
            }

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
      <View style={styles.container} backgroundColor={BACKGROUND_GREY}>
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.dismiss()} imagePath={require('../../assets/icons/back.png')}/>
        </View>

        <View style={styles.containerView} >
          <Text style={styles.name}>{this.props.discount.name}</Text>
          <View style={{height:64}}></View>
          <Text style={styles.offer}>{this.props.discount.offer}</Text>

        </View>

        <View style={styles.buttonContainer}>
          <View style={{ height: 64 }}>
            <SubmitButton title={'REDEEM'} />
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 32, marginLeft: 32, marginRight: 32
  },
  name: {
    fontFamily: 'roboto-bold', fontSize: 32,
    color: 'white',
    textAlign: 'center'
  },
  offer: {
    fontFamily: 'roboto-regular', fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  containerView: {
    flex: 3,
    marginLeft: 16, marginRight: 16,
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute', left: 20, top: 20,
    zIndex: 1001
  },
});

export default DiscountModal;
