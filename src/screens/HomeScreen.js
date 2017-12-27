import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types';
import * as API from '../api/api';
import * as DataBuilder from '../api/data-builder';
import * as Colors from '../constants/colors';

import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';

import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';

class HomeScreen extends Component {

  constructor() {
    super();

    this.state = {
      filterPresented: false,
      employeeFormPresented: false,
      placeFormPresented: false

    }
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount() {

  }

  componentWillMount() {

  }

  _changeTab = (index) => {
    this.props.dispatch({ type: (index === 0) ? TabActions.EMPLOYEE_TAB : TabActions.LOCATION_TAB });
  }

  _presentFilterModal = () => {
    this.setState({ filterPresented: true });
  }

  _dismissFilterModal = () => {
    this.setState({ filterPresented: false });
  }

  _presentAddEmployeeModal = () => {
    this.props.dispatch({ type: NavActions.EMPLOYEE_PROFILE });
    //this.setState({ employeeFormPresented: true });
  }

  _dismissEmployeeModal = () => {
    this.setState({ employeeFormPresented: false });
  }

  addPressed = () => {
    if(this.props.indexOn === 0) {
      this.setState({ employeeFormPresented: true });
    } else {
      Alert.alert('Present Places Form');
      this.setState({ placeFormPresented: true });
    }
  }

  _submitEmployeeForm(data) {

    // data.sessionID = this.props.sessionID;
    // data.ownerID = this.props.user._id;
    data = {
      ...data,
      "sessionID": this.props.sessionID,
      "ownerID": this.props.user._id
    }
    DataBuilder.buildEmployeeForm(data, (obj) => {
      API.createEmployee(obj, (err, emp) => {
        if(err) {
          Alert.alert(err.message);
        } else {
          console.log(emp);
        }
      });
    });
  }

  render() {
    let g = 100;
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this._presentFilterModal() } rightOnPress={() => this._presentAddEmployeeModal()} />
        </View>

        {(this.props.indexOn === 0)
          ? <EmployeeScreen />
          : <RestaurantScreen />
        }

        <TouchableOpacity onPress={this.addPressed} style={styles.addButton} >
          <Image style={{height:64,width:64}} source={require('../../assets/icons/plus.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this._presentFilterModal()} style={styles.filterButton} >
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal dismiss={() => this._dismissFilterModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.employeeFormPresented} >
          <EmployeeForm submitForm={(data) => this._submitEmployeeForm(data)} dismiss={() => this._dismissEmployeeModal()} />
        </Modal>



      </View>
    )
  }
}

const FRAME = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  filterButton: {
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center',
    left: 16, bottom: 16, borderRadius: 32,
    height: 64, width: FRAME.width / 2 - 32,
    backgroundColor: Colors.MID_GREY
  },
  filterText: {
    fontFamily: 'roboto-regular', fontSize: 16,
    color: Colors.DARK_GREY
  },
  addButton: {
    position: 'absolute',
    justifyContent: 'center', alignItems: 'center',
    right: 16, bottom: 16,
    height: 64, width: 64,
    backgroundColor: 'transparent'
  },
  tabContainer: {
    height: 72
  }
});

var mapStateToProps = state => {
  return {
    indexOn: state.tab.index,
    user: state.user.user,
    sessionID: state.user.sessionID
  }
}

export default connect(mapStateToProps)(HomeScreen);
