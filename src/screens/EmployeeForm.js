import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, DatePickerIOS, TouchableOpacity, StyleSheet, Modal, TextInput, Image } from 'react-native';

import { connect } from 'react-redux';

import EmployeeFormAddLocation from './EmployeeFormAddLocation';
import OptionView from '../ui-elements/option-view';
import * as Colors from '../constants/colors';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

class EmployeeForm extends Component {
  constructor() {
    super();

    this.state = {
      addLocationsPresented: false,
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
      ],
      employee: {
        name: "Jarrel Gooler",
        password: "abc123",
        position: "Head Chef",
        phone: "5094449999",
        email: "bruh@yahoo.com",
        gender: 0,
        hairColor: 0,
        birthday: new Date(1997, 8, 3),
        hireDate: new Date()
      }
    };
  }

  static propTypes = {
    dismiss: PropTypes.func,
    submitForm: PropTypes.func,
    places: PropTypes.array,
    edit: PropTypes.bool,
    isOwner: PropTypes.bool
  }
  static defaultPropTypes = {
    edit: false
  }

  componentDidMount() {
    this.setState({ places: this.props.places });

    this.genderSelected(this.state.employee.gender);
    this.hairSelected(this.state.employee.hairColor);
  }

  submit = () => {
    console.log(this.state.employee);
    // this.state.employee.password = 'abc123';
    this.props.submitForm(this.state.employee);
    this.props.dismiss();
  }


  genderSelected = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr, employee: {...this.state.employee, gender: index } });
    });
  }

  hairSelected = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr, employee: {...this.state.employee, hairColor: index } });
    });
  }

  textInputFactory(placeholder, onTextChange, value, capitalize = true, keyboard = 'default', canEdit) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={(capitalize ? 'words' : 'none')}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
        editable={canEdit} keyboardType={keyboard}
      />
    )
  }

  bdayTextInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.birthdayInput}
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={(this.props.edit) ? value : null}
        editable={!this.props.isOwner} keyboardType={'numeric'}
      />
    )
  }

  render() {

    console.log(this.state);
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.container} >

          <Modal animationType={'slide'} transparent={false} visible={this.state.addLocationsPresented} >
            <EmployeeFormAddLocation
              dismissModal={() => this.setState({ addLocationsPresented: false }) }
              addLocations={(places) => this.setState({ employee: { ...this.state.employee, places: places }}) }
            />
          </Modal>

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} />
          </View>

          <Text style={styles.textHeader} >Employee Name</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Name', (text) => this.setState({ employee: {...this.state.employee, name: text}}), this.state.employee.name, true)
            }
          </View>

          <Text style={styles.textHeader} >Email</Text>
          <View style={styles.inputView} >
            {
              this.textInputFactory('Email', (text) => this.setState({ employee: {...this.state.employee, email: text}}), this.state.employee.email, false, 'email-address', true)
            }
          </View>

          <Text style={styles.textHeader} >Position</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Job Title', (text) => this.setState({ employee: {...this.state.employee, position: text}}), this.state.employee.position, this.props.isOwner)}
          </View>



          <Text style={styles.textHeader} >Phone Number</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('555.555.5555', (text) => this.setState({ employee: {...this.state.employee, phone: text}}), this.state.employee.phone, true)}
          </View>

          <Text style={styles.textHeader} >Birthday</Text>
          <View style={styles.dateView} >
            <DatePickerIOS
              onDateChange={(date) => { this.setState({ employee: {...this.state.employee, birthday: date }}) }}
              date={this.state.employee.birthday}
              mode={'date'} maximumDate={new Date()}
            />
          </View>

          <Text style={styles.textHeader} >Hire Date</Text>
          <View style={styles.dateView} >
            <DatePickerIOS
              onDateChange={(date) => { this.setState({ employee: {...this.state.employee, hireDate: date }}) }}
              date={this.state.employee.hireDate}
              mode={'date'} maximumDate={new Date()}
            />
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
            {this.textInputFactory('99', (text) => this.setState({ employee: {...this.state.employee, age: text}}), this.state.employee.age, this.props.isOwner)}
          </View>

          {/*(this.state.places.length > 0)
          ? <View style={styles.optionContainer} >
              <OptionView options={this.state.hairOptions} selectOption={(index) => this.hairSelected(index)} />
            </View>
          : null
          */}

          <View style={styles.imageContainer} >
            <Image style={styles.image} />
          </View>
          <Text style={styles.imageText}>Upload Employee Image</Text>


          <View style={styles.submitContainer} >
            <SubmitButton title={'ADD RESTAURANTS'} onPress={() => this.setState({ addLocationsPresented: true }) } />
          </View>
          <View style={styles.submitContainer} >
            <SubmitButton title={'ADD EMPLOYEE'} onPress={() => this.submit()} />
          </View>

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
  dateView: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1, borderRadius: 8,
    backgroundColor: 'white'
  },
  birthdayView: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  birthdayInput: {
    marginLeft: 16, marginRight: 16,
    fontSize: 18,
    color: 'black'
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    isOwner: state.user.isOwner
  }
}

export default connect(mapStateToProps)(EmployeeForm);
