import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import CreateDiscountForm from './CreateDiscountForm';

import RoundButton from '../ui-elements/round-button';
import SubmitButton from '../ui-elements/submit-button';
import RainbowButton from '../ui-elements/rainbow-button';

import { BACKGROUND_GREY, YELLOW } from '../constants/colors';

class DiscountModal extends Component {

  static navigationOptions = {
    header: null
  }

  static propTypes = {
    dismiss: PropTypes.func,
    placeName: PropTypes.string,
    discount: PropTypes.object,
    editDiscountPresented: PropTypes.bool,
    myRole: PropTypes.number
  }

  static defaultProps = {
    editDiscountPresented: false,
    placeName: ''
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
      <View style={{ flex: 1, backgroundColor: BACKGROUND_GREY, justifyContent:'center' }} >
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.props.dismiss()} imagePath={require('../../assets/icons/down.png')}/>
        </View>

        <View style={styles.editButton} >
          {this.canEdit()}
        </View>

        <View style={{height:140}} />
        <View style={styles.containerView} >
          <Text style={styles.name}>{this.props.discount.name}</Text>
          <View style={{height:64}} />
          <Text style={styles.offer}>{this.props.discount.offer}</Text>
        {/* 
          <View style={{flex: 1, backgroundColor: 'green'}}>
            <Text>{this.props.placeName}</Text>
          </View>
          <View style={{flex: 1, backgroundColor: 'orange'}}>
            
          </View>
          */}

        </View>

        <View style={styles.buttonContainer}>
          <View style={{ height: 64 }}>
            <RainbowButton title={'Yeah Boiiiii'} onPress={this.props.dismiss} />
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
    color: 'white',
    textAlign: 'center'
  },
  offer: {
    fontFamily: 'roboto-bold', fontSize: 24,
    marginLeft: 16, marginRight: 16,
    color: 'white',
    textAlign: 'center'
  },
  containerView: {
    // flex: 3,
    height: 320, borderRadius: 8,
    backgroundColor: YELLOW,
    marginLeft: 32, marginRight: 32,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4
  },
  editButton: {
    position: 'absolute',
    right: 16, top: 16,
    ...ifIphoneX({
      top: 40
    }),
    zIndex: 1001
  },
  backButton: {
    position: 'absolute',
    left: 16, top: 16,
    ...ifIphoneX({
      top: 40
    }),
    zIndex: 1001
  },
});

export default DiscountModal;
