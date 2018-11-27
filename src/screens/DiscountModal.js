import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';

import CreateDiscountForm from './CreateDiscountForm';

import RoundButton from '../ui-elements/round-button';
import SubmitButton from '../ui-elements/submit-button';
import RainbowButton from '../ui-elements/rainbow-button';

import { BACKGROUND_GREY } from '../constants/colors';

let red =255, blue=0, green=0, colorIndex=0;

class DiscountModal extends Component {

  static navigationOptions = {
    header: null
  }

  static propTypes = {
    dismiss: PropTypes.func,
    discount: PropTypes.object,
    editDiscountPresented: PropTypes.bool,
    myRole: PropTypes.number
  }

  static defaultProps = {
    editDiscountPresented: false
  }

  constructor() {
    super();

    this.state = {
      editDiscountPresented: false
    }
  }

  presentEditDiscount = () => {
    this.setState({ editDiscountPresented: true });
  }

  makeColor() {
    return 'rgb(' + this.state.red + ',' + this.state.green + ',' + this.state.blue + ')';
  }

  _dismissEditDiscountModal = () => {
    this.setState({ editDiscountPresented: false }, () => {
      this.props.dismiss();
    })
  }

  canEdit = () => {
    if(this.props.myRole === 1 || this.props.myRole === 2) {
      return (
        <RoundButton onPress={this.presentEditDiscount} imagePath={require('../../assets/icons/pencil.png')} />
      )
    }
    return null;
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor: BACKGROUND_GREY }} >
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.dismiss()} imagePath={require('../../assets/icons/down.png')}/>
        </View>

        <View style={styles.editButton} >
          {this.canEdit()}
        </View>

        <View style={styles.containerView} >
          <Text style={styles.name}>{this.props.discount.name}</Text>
          <View style={{height:64}}></View>
          <Text style={styles.offer}>{this.props.discount.offer}</Text>

        </View>

        <View style={styles.buttonContainer}>
          <View style={{ height: 64 }}>
            <RainbowButton title={'REDEEM'} onPress={this.props.dismiss} />
          </View>
        </View>

        <Modal animationType={'slide'} transparent={false} visible={this.state.editDiscountPresented} >
          <CreateDiscountForm edit={true} discount={this.props.discount} dismiss={() => this._dismissEditDiscountModal()}/>
        </Modal>

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
    color: 'black',
    textAlign: 'center'
  },
  offer: {
    fontFamily: 'roboto-bold', fontSize: 24,
    marginLeft: 16, marginRight: 16,
    color: 'black',
    textAlign: 'center'
  },
  containerView: {
    flex: 3,
    marginLeft: 16, marginRight: 16,
    justifyContent: 'center'
  },
  editButton: {
    position: 'absolute',
    right: 24, top: 40,
    zIndex: 1001
  },
  backButton: {
    position: 'absolute',
    left: 24, top: 40,
    zIndex: 1001
  },
});

export default DiscountModal;
