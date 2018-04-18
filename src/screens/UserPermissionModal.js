import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { assignSinglePlacePositionToUser } from '../util/permission-manager';

import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';
import RoundButton from '../ui-elements/round-button';
import SubmitButton from '../ui-elements/submit-button';

import * as Colors from '../constants/colors';

class UserPermissionModal extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  }

  static propTypes = {
    dismiss: PropTypes.func,
    location: PropTypes.object,
    updatePermission: PropTypes.func
  }

  constructor() {
    super();

    this.assignSinglePlacePositionToUser = assignSinglePlacePositionToUser.bind(this);

    this.state = {
      roleOptions: [
        { value: 'Employee', selected: false, index: 0 },
        { value: 'Manager', selected: false, index: 1 },
        { value: 'Owner', selected: false, index: 2 }
      ],
      positionOptions: [
        { value: '', selected: false, index: 0 }
      ]
    }
  }

  componentDidMount() {
    this.roleSelected(this.props.location.relation.role);
    this.assignSinglePlacePositionToUser(this.props.location, (place) => {
      this.setState({ positionOptions: place.positions });
    })
  }

  roleSelected = (index) => {
    OptionView.selected(this.state.roleOptions, index, (arr) => {
      this.setState({ roleOptions: arr, roleSelected: this.state.roleOptions[index] });
    });
  }

  positionSelected = (index) => {
    OptionView.selected(this.state.positionOptions, index, (arr) => {
      this.setState({ positionOptions: arr, positionSelected: this.state.positionOptions[index] });
    })
  }

  submit = () => {
    let position = this.state.positionOptions.find((option) => { return option.selected });
    this.props.updatePermission(this.state.roleSelected.index, this.props.location, position.value);
    this.props.dismiss();
  }

  render() {
    return(
      <View style={styles.container} >
        <ScrollView style={styles.container} >

          <View style={styles.backButton} >
            <RoundButton onPress={this.props.dismiss} imagePath={require('../../assets/icons/back.png')} />
          </View>

          <Text style={styles.nameHeader}>{this.props.employee.first_name} {this.props.employee.last_name}</Text>

          <View style={styles.locationContainer} >
            <Text style={styles.headerBold}>{(this.state.roleOptions[0].selected) ? 'EMPLOYEE' : (this.state.roleOptions[1].selected) ? 'MANAGER' : 'OWNER'}</Text>
            <Text style={styles.header}>    at    </Text>
            <Text style={styles.headerBold}>{this.props.location.name}</Text>
          </View>

          <Text style={styles.textHeader}>Role</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.roleOptions} selectOption={(index) => this.roleSelected(index)} />
          </View>

          <Text style={styles.textHeader}>Position</Text>
          <View style={styles.optionContainer} >
            <OptionViewSplit
              options={this.state.positionOptions}
              selectOption={(index) => this.positionSelected(index)}
            />
          </View>


        </ScrollView>

        <View style={styles.submitButton} >
          <SubmitButton title={'UPDATE'} onPress={() => this.submit()} />
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.BACKGROUND_GREY
  },
  submitButton: {
    position: 'absolute',
    bottom: 32, left: 32, right: 32, height: 64
  },
  backButton: {
    marginLeft: 16, marginTop: 32, marginBottom: 32
  },
  headerBold: {
    fontSize: 24, fontFamily: 'roboto-bold', marginTop: 8, marginBottom: 8,
  },
  header: {
    fontSize: 16, fontFamily: 'roboto-regular', marginBottom: 8, color: Colors.DARK_GREY
  },
  locationContainer: {
    flex: 1, flexDirection: 'column', flexWrap: 'wrap',
    marginTop: 64, marginBottom: 16, marginLeft: 16, marginRight: 16,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.MID_GREY, borderRadius: 8
  },
  locationHeader: {
    marginRight: 16, fontSize: 24,
    fontFamily: 'roboto-bold', textAlign: 'right',
  },
  nameHeader: {
    fontSize: 24, marginTop: 8,
    fontFamily: 'roboto-bold', textAlign: 'center'
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 24, marginRight: 16, marginLeft: 16,
    flex: 1,
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
    }
});

var mapStateToProps = state => {
  return {
    employee: state.detail.user
  }
}

export default connect(mapStateToProps)(UserPermissionModal);
