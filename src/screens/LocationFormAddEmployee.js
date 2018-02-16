import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet }
import { connect } from 'react-redux';

import * as Colors from '../constants/colors';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';



class LocationFormAddEmployee extends Component {

  constructor() {
    super();

    state = {
      employees: [
        { name: 'ABC', _id: '123', selected: false }
      ],
      selectedEmployees: []
    }

  }

  static propTypes = {
    dismissModal: PropTypes.func,
    addEmployees: PropTypes.func,
    employees: PropTypes.array
  }

  componentWillMount() {
    // this.loadLocations();
    debugger;
    let myEmployees = this.props.employees;
    let empCount = 0;
    for(let i = 0; i < myEmployees.length; i++) {
      myEmployees[i].selected = false;
      myEmployees[i].index = i;
      empCount++;
      if(empCount === myEmployees.length) {
        this.setState({ employees: myEmployees });
      }
    }
  }

  selectPlace = (emp) => {
    this.state.employees[emp.index].selected = !this.state.employees[emp.index].selected;
    this.setState({ employees: this.state.employees });
  }

  submit() {
    let selectedEmployees = [];
    for(let i = 0; i < this.state.employees.length; i++) {
      if(this.state.employees[i].selected) {
        selectedEmployees.push({ "user_id": this.state.employees[i]._id });
      }
    }
    this.props.addEmployees(selectedEmployees);
    this.props.dismissModal();
  }


  render() {

    return(

      <ScrollView style={styles.scrollContainer} >

        <View style={styles.backButton} >
          <RoundButton onPress={this.props.dismissModal} />
        </View>

        <View style={styles.buttonContainer} >
          {(this.state) ? this.state.employees.map((emp) => (
            <TouchableOpacity
              onPress={() => this.selectPlace(place) }
              style={ ((emp.selected) ? styles.buttonOn : styles.buttonOff) }
              key={emp._id}
            >
              <Text style={(emp.selected) ? styles.textOn : styles.textOff} >
                {emp.name}
              </Text>
            </TouchableOpacity>
          )) : null}
        </View>

        <View style={styles.submitButton} >
          <SubmitButton onPress={() => this.submit() } title={'SUBMIT'} />
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
  submitButton: {
    marginLeft: 32, marginRight: 32, marginBottom: 64
  },
  container: {
    flex: 1
  },
  buttonContainer: {
    flex: 1
  },
  buttonOn: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 32,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 64,
    borderRadius: 24,
    marginRight: 32, marginLeft: 32, marginBottom: 32,
    backgroundColor: Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-regular'
  },
  textOff: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-regular'
  },
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
});

var mapStateToProps = state => {
  return {
    sessionID: state.user.sessionID,
    employees: state.user.myEmployees
  }
}

export default connect(mapStateToProps)(LocationFormAddEmployee);
