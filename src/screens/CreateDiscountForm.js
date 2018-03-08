import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import OptionView from '../ui-elements/option-view';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

class CreateDiscountForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      exclusiveOptions: [
        { value: 'MANAGEMENT', selected: true, index: 0 },
        { value: 'EMPLOYEES', selected: false, index: 1 }
      ]
    }
  }

  static propTypes = {
    dismiss: PropTypes.func
  }

  componentDidMount() {

  }

  createDiscount = () => {
    let exclusive = this.state.exclusiveOptions[0].selected;
    let discountData = {
      "name": this.state.name,
      "offer": this.state.description,
      "placeID": this.props.locationID,
      "exclusive": exclusive
    };
    // var data = {
    //   ...discountData,
    //   "sessionID": this.props.sessionID,
    // }
    API.createDiscount(discountData, (err, response) => {
      if(err) {
        console.log(err);
      } else {
        console.log(response);
        this.props.dismiss();
      }
    });
  }

  optionSelected = (index) => {
    OptionView.selected(this.state.exclusiveOptions, index, (arr) => {
      this.setState({ exclusiveOptions: arr });
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

          <View style={styles.backButton} >
            <RoundButton imagePath={require('../../assets/icons/back.png')} onPress={this.props.dismiss} />
          </View>

          <Text style={styles.textHeader}>Name</Text>
          <View style={styles.inputView}>
            {this.textInputFactory('Name', (text) => this.setState({ name: text }), this.state.name)}
          </View>


          <Text style={styles.textHeader}>Description</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Description', (text) => this.setState({ description: text }), this.state.description)}
          </View>

          <Text style={styles.textHeader}>Access to the discount</Text>
          <View style={styles.optionContainer} >
            <OptionView
              options={this.state.exclusiveOptions}
              selectOption={(index) => this.optionSelected(index)}
            />
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
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16, marginTop: 84
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16,
    flex: 1,
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
    locationID: state.detail.location._id
  }
}

export default connect(mapStateToProps)(CreateDiscountForm);
