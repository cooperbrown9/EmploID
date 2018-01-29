import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

class CreateDiscountForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: ''
    }
  }

  static propTypes = {
    dismiss: PropTypes.func
  }

  componentDidMount() {

  }

  createDiscount = () => {
    let discountData = { "name": this.state.name, "offer": this.state.description, "ownerID": this.props.userID, "placeID": this.props.locationID };
    var data = {
      ...discountData,
      "sessionID": this.props.sessionID,
      "userID": this.props.userID
    }
    API.createDiscount(data, (err, response) => {
      if(err) {
        console.log(err);
      } else {
        console.log(response);
        this.props.dismiss();
      }
    });
  }

  textInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={value}
      />
    )
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <Text style={styles.textHeader}>Name</Text>
          <View style={styles.inputView}>
            {this.textInputFactory('Name', (text) => this.setState({ name: text }), this.state.name)}
          </View>


          <Text style={styles.textHeader}>Description</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Description', (text) => this.setState({ description: text }), this.state.description)}
          </View>

        </View>

        <View style={styles.submitButton} >
          <SubmitButton title={'CREATE DISCOUNT'} onPress={() => this.createDiscount()} />
        </View>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16, marginTop: 84
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  input: {
    marginLeft: 16,
    fontSize: 18, fontFamily: 'roboto-regular',
    color: 'black'
  },
  submitButton: {
    marginTop: 64, marginLeft: 32, marginRight: 32
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    sessionID: state.user.sessionID,
    userID: state.user.userID,
    locationID: state.locationDetail.location._id
  }
}

export default connect(mapStateToProps)(CreateDiscountForm);
