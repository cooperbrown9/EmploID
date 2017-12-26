import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import * as NavActions from '../action-types/nav-action-types'; 
import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';
import FilterModal from './FilterModal';
import EmployeeForm from './EmployeeForm';

class HomeScreen extends Component {

  constructor() {
    super();

    this.state = {
      filterPresented: false,
      employeePresented: false,

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
    //this.setState({ employeePresented: true });
  }

  _dismissEmployeeModal = () => {
    this.setState({ employeePresented: false });
  }

  render() {
    let g = 100;
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this._presentFilterModal() } rightOnPress={() => this._presentAddEmployeeModal()} />
        </View>

        <RestaurantScreen/>

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal dismiss={() => this._dismissFilterModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.employeePresented} >
          <EmployeeForm dismiss={() => this._dismissEmployeeModal()} />
        </Modal>
      {//  <View style={styles.tabContainer} >
          // <TabBar changeTab={(index) => this._changeTab(index)}/>


        //</View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  tabContainer: {
    height: 72
  }
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(HomeScreen);
