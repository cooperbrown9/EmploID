import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';

import { connect } from 'react-redux';
import OptionView from '../ui-elements/option-view';
import * as Colors from '../constants/colors';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

class EmployeeForm extends Component {
  constructor() {
    super();

    this.state = {
      genderOptions: [
        { value: 'Male', selected: false, index: 0},
        { value: 'Female', selected: false, index: 1},
        { value: 'Other', selected: false, index: 2}
      ],
      hairOptions: [
        { value: 'Brown', selected: false, index: 0},
        { value: 'Red', selected: false, index: 1},
        { value: 'Black', selected: false, index: 2},
        { value: 'Grey', selected: false, index: 3},
        { value: 'Blonde', selected: false, index: 4},
        { value: 'Other', selected: false, index: 5}
      ]
    };
  }

  static propTypes = {
    dismiss: PropTypes.func
  }

  genderSelected = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr });
    });
  }

  hairSelected = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr });
    });
  }

  textInputFactory(placeholder, onTextChange) {
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE}
        style={styles.input}
        autoCorrect={false}
        onChangeText={(text) => onTextChange(text)}
      />
    )
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} />
          </View>

          <Text style={styles.textHeader} >Employee Name</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Name', (text) => this.setState({ name: text}))}
          </View>

          <Text style={styles.textHeader} >Position</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Job Title', (text) => this.setState({ position: text}))}
          </View>

          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('555.555.5555', (text) => this.setState({ phone: text}))}
          </View>

          <Text style={styles.textHeader}>Gender</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.genderOptions} selectOption={(index) => this.genderSelected(index)} />
          </View>

          <Text style={styles.textHeader}>Hair Color</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.hairOptions} selectOption={(index) => this.hairSelected(index)} />
          </View>

          <Text style={styles.textHeader} >Age</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('99', (text) => this.setState({ age: text}))}
          </View>

          <View style={styles.imageContainer} >
            <Image style={styles.image} />
          </View>
          <Text style={styles.imageText}>Upload Employee Image</Text>

          <TouchableOpacity onPress={() => this.props.dismiss()} style={styles.submitContainer} >
            <SubmitButton />
          </TouchableOpacity>

          <View style={{height: 64}}/>
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
    marginLeft: 16, marginRight: 16
  },
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
  submitContainer: {
    marginLeft: 16, marginRight: 16, marginTop: 16
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: 'yellow'
  },
  imageText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16,
    flex: 1,
  },
  input: {
    marginLeft: 16,
    fontSize: 18,
    color: 'black'
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

export default EmployeeForm;
