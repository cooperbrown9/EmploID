import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as Colors from '../constants/colors';
import * as _ from 'lodash';

import OptionViewSplit from '../ui-elements/option-view-split';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';



class RestaurantFormAddEmployee extends Component {

  constructor() {
    super();

    this.state = {
      users: [
        { name: 'ABC', _id: '123', selected: false, positions: [] }
      ],
      selectedEmployees: []
    }
  }

  static propTypes = {
    dismissModal: PropTypes.func,
    addEmployees: PropTypes.func,
    employees: PropTypes.array,
    positions: PropTypes.array
  }

  // call parsePositions first, then attach positions to each employee
  componentWillMount() {
    this.parsePositions(() => {
      this.parseEmployees();
    });
  }

  parseEmployees() {
    let myEmployees = this.props.employees;
    let positions = this.props.positions;
    myEmployees.forEach((e, index) => {
      e.selected = false;
      e.index = index;

      let positionObjs = [];
      positions.forEach((p, pIndex) => {
        positionObjs.push({value:p,index:pIndex,selected:false})
      });

      e.positions = positionObjs;
    });
    this.setState({ users: myEmployees });
  }

  parsePositions(callback) {
    let positions = this.props.positions;
    let positionObjs = [];
    positions.forEach((p, index) => {
      positionObjs.push({ value: p, index: index, selected: false });
    });
    this.setState({ positions: positionObjs }, () => callback());
  }

  selectUser = (user) => {
    this.state.users[user.index].selected = !this.state.users[user.index].selected;
    this.setState({ users: this.state.users });
  }

  positionSelected = (index, user) => {
    user.positions[index].selected = !user.positions[index].selected;
    for(let i = 0; i < this.state.users.length; i++) {
      if(this.state.users[i]._id === user._id) {
        this.state.users[i] = user;
        break;
      }
    }
    this.setState({ users: this.state.users });
  }

  submit() {
    let selectedUsers = [];
    for(let i = 0; i < this.state.users.length; i++) {
      if(this.state.users[i].selected) {
        let positions = [];
        this.state.users[i].positions.forEach((p) => {
          if(p.selected) {
            positions.push(p.value);
          }
        });

        selectedUsers.push({ 'userID': this.state.users[i]._id, 'role': 0, 'positions': positions });
      }
    }
    this.props.addEmployees(selectedUsers);
    this.props.dismissModal();
  }


  render() {

    return(
      <View style={{flex: 1}} >
        <View style={styles.backButton} >
          <RoundButton onPress={this.props.dismissModal} imagePath={require('../../assets/icons/down.png')} />
        </View>
        <ScrollView style={styles.scrollContainer} >
          <View style={{height:116 }} />

          <View style={styles.buttonContainer} >
            {(this.state) ? this.state.users.map((user) => (
              <View style={(user.selected) ? styles.userContainerOn : styles.userContainerOff} key={user._id} >
                <TouchableOpacity
                  onPress={() => this.selectUser(user) }
                  style={ ((user.selected) ? styles.buttonOn : styles.buttonOff) }
                  key={user._id} >
                  <Text style={(user.selected) ? styles.textOn : styles.textOff} >
                    {user.first_name} {user.last_name}
                  </Text>
                </TouchableOpacity>
                {(user.selected)
                  ? <View style={styles.optionContainer} >
                      <OptionViewSplit options={user.positions} selectOption={(index) => this.positionSelected(index, user)} />
                    </View>
                  : null
                }
              </View>
            )) : null}
          </View>

          <View style={styles.submitButton} >
            <SubmitButton onPress={() => this.submit() } title={'SUBMIT'} />
          </View>

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white'//Colors.BACKGROUND_GREY
  },
  submitButton: {
    marginLeft: 32, marginRight: 32, marginBottom: 32
  },
  container: {
    flex: 1
  },
  userContainerOff: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: Colors.MID_GREY,
    overflow: 'hidden'
  },
  userContainerOn: {
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
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
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
    marginRight: 32, marginLeft: 32, marginBottom: 32, marginTop: 8,
    backgroundColor: 'transparent', //Colors.MID_GREY,
    justifyContent: 'center'
  },
  textOn: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: 'white', textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  textOff: {
    fontSize: 28,
    marginLeft: 16, marginRight: 16,
    color: Colors.DARK_GREY, textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  backButton: {
    position: 'absolute', left:16,top: 40, zIndex: 100000
  },
});

var mapStateToProps = state => {
  return {
    sessionID: state.user.sessionID,
    employees: state.user.myEmployees
  }
}

export default connect(mapStateToProps)(RestaurantFormAddEmployee);
