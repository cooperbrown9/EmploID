import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

import { connect } from 'react-redux';

import TabBar from '../ui-elements/tab-bar';
import * as TabActions from '../action-types/tab-action-types';
import EmployeeScreen from './EmployeeScreen.js';
import RestaurantScreen from './RestaurantScreen.js';
import FilterModal from './FilterModal';
import AddEmployeeForm from './AddEmployeeForm';

class HomeScreen extends Component {

  constructor() {
    super();

    this.state = {
      filterPresented: false,
      addEmployeePresented: true,
      
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
    this.setState({ addEmployeePresented: true });
  }

  _dismissAddEmployeeModal = () => {
    this.setState({ addEmployeePresented: false });
  }

  render() {
    let g = 100;
    return (
      <View style={styles.container} >
        <View style={styles.tabContainer} >
          <TabBar changeTab={(index) => this._changeTab(index)} leftOnPress={() => this._presentFilterModal() } rightOnPress={() => this._presentAddEmployeeModal()} />
        </View>

        <Modal animationType={'slide'} transparent={false} visible={this.state.filterPresented} >
          <FilterModal dismiss={() => this._dismissFilterModal()} />
        </Modal>

        <Modal animationType={'slide'} transparent={false} visible={this.state.addEmployeePresented} >
          <AddEmployeeForm dismiss={() => this._dismissAddEmployeeModal()} />
        </Modal>

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
    height: 64
  }
});

var mapStateToProps = state => {
  return {
    ...state
  }
}

export default connect(mapStateToProps)(HomeScreen);
