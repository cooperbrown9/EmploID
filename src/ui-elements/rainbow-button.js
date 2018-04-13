import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class RainbowButton extends Component {
  constructor() {
    super();

    this.state = {
      red: 255,
      green: 0,
      blue: 0,
      colorIndex: 0
    }
  }

  static propTypes = {
    title: PropTypes.string
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
            // colorIndex = 1;
            this.setState({ colorIndex: 1 })
          } else {
            // green++;
            this.setState({ green: ++this.state.green });
          }
          break;

        case 1: // ORANGE to YELLOW
          if(this.state.green === 255) {
            this.setState({ colorIndex: 2 });
            // colorIndex = 2;
          } else {
            this.setState({ green: ++this.state.green });
            // green++;
          }
          break;

        case 2: // YELLOW to GREEN
          if(this.state.red === 0) {
            this.setState({ colorIndex: 3 });
            // colorIndex = 3;
          } else {
            this.setState({ red: --this.state.red });
            // red--;
          }
          break;

        case 3: // GREEN to BLUE
          if(this.state.blue === 255) {
            this.setState({ green: --this.state.green });
            // green--;
            if(this.state.green === 0) {
              this.setState({ colorIndex: 4 })
              // colorIndex = 4;
            }
          } else {
            this.setState({ blue: ++this.state.blue })
            // blue++;
          }
          break;

        case 4: // BLUE to PURPLE
          if(this.state.red === 148) {
            this.setState({ blue: --this.state.blue });
            // blue--;
            if(this.state.blue === 211) {
              this.setState({ colorIndex: 5 });
              // colorIndex = 5;
            }
          } else {
            this.setState({ red: ++this.state.red });
            // this.state.red++;
          }

          case 5:
            if(this.state.blue === 0) {
              // this.setState({ red: ++this.state.red });
              this.state.red++;
              if(this.state.red === 255) {
                this.setState({ colorIndex: 0 });
                // colorIndex = 0;
              }
            } else {
              this.setState({ blue: --this.state.blue });
              // blue--;
            }

        default:
          console.log('yuh');
          break;
      }
    }, 10);
  }

  render() {
    return (
      <View style={styles.container} >
        <TouchableOpacity style={{
          flex: 1,
          height: 48,
          backgroundColor: 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')',
          borderRadius: 16,
          justifyContent: 'center',
        }} >
          <Text style={styles.text}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontFamily: 'roboto-bold'
  }
});

export default RainbowButton;
