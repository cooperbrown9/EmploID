import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

import PositionRoleSelector from '../ui-elements/position-role-selector';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import { roles, positions } from '../constants/roles-and-positions';

class AddEmployeesToRestaurant extends Component {

  constructor() {
    super();

    this.state = {
      places: [
        { name: '', _id: '', selected: false, index: 0 }
      ],
      employees: [
        {
          first_name: '', last_name: '',
          selected: false, index: 0,
          positions: [
            { value: '', selected: false, index: 0 }
          ]
        }
      ],
      selectedPlaces: []
    }
  }

  static propTypes = {
    dismiss: PropTypes.func,
    place: PropTypes.object,
    employees: PropTypes.array,
    addEmployees: PropTypes.func
  }

  componentDidMount() {
    this.state.employees = this.props.employees;

    this.state.employees.map((employee, index) => {
      employee.selected = false;
      employee.index = index;
      employee.animation = 1;
      employee.positions = [];
      employee.roles = []

      this.props.place.positions.forEach((position, index) => {
        employee.positions.push({ value: position, selected: false, index: index });
      });

      roles.forEach((role, index) => {
        employee.roles.push({ value: role.value, selected: (index == 0) ? true : false, index: index })
      })
    });

    this.setState({ employee: this.state.employees });
  }

  _onPositionSelected = (index, employee) => {
    employee.positions[index].selected = !employee.positions[index].selected;
    for(let i = 0; i < this.state.employees.length; i++) {
      if(this.state.employees[i]._id === employee._id) {
        this.state.employees[i] = employee;
        break;
      }
    }
    this.setState({ places: this.state.places });
  }

  _onRoleSelected = (index, employee) => {
    // make all false, then make the index the one that is true
    employee.roles.map((role) => role.selected = false)
    employee.roles[index].selected = true

    // find index of employee to change on the state, then assign updated employee to it
    let indexOfEmployee = this.state.employees.indexOf((emp) => emp._id == employee._id)
    this.state.employees[indexOfEmployee] = employee

    this.setState({ employees: this.state.employees })
  }

  selectEmployee = (employee) => {
    var animationProps = {
      type: 'timing',
      springDamping: 0.8,
      property: 'opacity'
    }

    var animationConfig = {
      duration: 250,
      create: animationProps,
      update: animationProps
    }
    LayoutAnimation.configureNext(animationConfig);

    this.state.employees[employee.index].selected = !this.state.employees[employee.index].selected;
    this.setState({ employee: this.state.employees });
  }

  submit() {
    let selectedEmployees = [];
    for(let i = 0; i < this.state.employees.length; i++) {

      // if employee is selected, find the position selected for it
      if(this.state.employees[i].selected) {
        // loop thru selected place's positions
        let positions = [];
        this.state.employees[i].positions.forEach((pos) => {
          if(pos.selected) {
            positions.push(pos.value);
          }
        });

        let role = 0
        role = this.state.employees[i].roles.find((role) => role.selected).index

        selectedEmployees.push({
          'userID': this.state.employees[i]._id,
          'positions': positions,
          'role': role,
          'placeID': this.props.place._id
        });
      }
    }

    this.props.addEmployees(selectedEmployees);
    this.props.dismiss();
  }

  // wrapper for props.dismiss() because this clears the state
  dismiss = () => {
    this.props.dismiss();
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.backButton} >
          <RoundButton onPress={() => this.dismiss()} imagePath={require('../../assets/icons/down.png')} />
        </View>

          <View style={styles.buttonContainer} >
            {(this.state) ? this.state.employees.map((employee) => (
              <Animated.View style={(employee.selected) ? [styles.employeeContainerOn, {flex: employee.animation}] : styles.employeeContainerOff} key={employee._id} >
                <TouchableOpacity
                  onPress={() => this.selectEmployee(employee) }
                  style={[styles.buttonOff, (employee.selected) ? styles.buttonOn : {}]}
                  key={employee._id} >
                  <Text style={[styles.textOff, (employee.selected) ? styles.textOn : {}]} >
                    {employee.first_name} {employee.last_name}
                  </Text>
                </TouchableOpacity>
                {(employee.selected)
                  ? <PositionRoleSelector
                      parent={employee}
                      onPositionSelected={(index, employee) => this._onPositionSelected(index, employee)}
                      onRoleSelected={(index, employee) => this._onRoleSelected(index, employee)}
                      />
                  : null
                }


              </Animated.View>
            )) : null}
          </View>

          <View style={styles.submitButton} >
            <SubmitButton onPress={() => this.submit() } title={'SUBMIT'} />
          </View>

      </ScrollView>
    )
  }
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white'//Colors.BACKGROUND_GREY
  },
  submitButton: {
    marginLeft: 32, marginRight: 32, marginBottom: 32,
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  container: {
    flex: 1
  },
  employeeContainerOff: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: Colors.MID_GREY,
    overflow: 'hidden'
  },
  employeeContainerOn: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: Colors.BACKGROUND_GREY,
    overflow: 'hidden'
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 8, marginLeft: 4, marginRight: 4,
    flex: 1,
  },
  buttonContainer: {
    flex: 1
  },
  buttonOn: {
    height: 64, //borderRadius: 24,
    marginRight: 0, marginLeft: 0, marginBottom: 16, marginTop: 0,
    backgroundColor: Colors.BLUE,//'black',
    justifyContent: 'center'
  },
  buttonOff: {
    height: 64,
    // borderRadius: 24,
    marginRight: 0, marginLeft: 0, marginBottom: 16, marginTop: 0,
    backgroundColor: 'transparent', //Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-bold', backgroundColor: 'transparent'
  },
  textOff: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-bold', backgroundColor: 'transparent'
  },
  backButton: {
    marginLeft: 16, marginTop: 48, marginBottom: 32
  },
});

var mapStateToProps = state => {
  return {
    user: state.user.user,
    sessionID: state.user.sessionID,
    employees: state.user.myEmployees.filter((employee) => {
      let doesWorkHere = false;

      // compare all my employees to employees at this restaurant
      // pull out unique employees; employees that dont work here
      for(let i = 0; i < state.detail.employees.length; i++) {
        if(employee._id == state.detail.employees[i]._id) {
          doesWorkHere = true;
          i = state.detail.employees.length;
        }
      }

      return !doesWorkHere;
    }),
    places: state.user.myLocations.filter((loc) => {
      return loc.relation.role >= 1;
    })
  }
}

export default connect(mapStateToProps)(AddEmployeesToRestaurant);
