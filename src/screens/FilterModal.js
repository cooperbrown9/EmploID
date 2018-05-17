import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import OptionView from '../ui-elements/option-view';
import OptionViewSplit from '../ui-elements/option-view-split';

class FilterModal extends Component {

  constructor() {
    super();

    this.state = {
      jobOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Busser', selected: false, index: 3 },
        { value: 'Manager', selected: false, index: 4 },
        { value: 'Chef', selected: false, index: 5 },
        { value: 'Cook', selected: false, index: 6 },
        { value: 'Dishwasher', selected: false, index: 7 }
      ],
      genderOptions: [
        { value: 'Male', selected: false, index: 0},
        { value: 'Female', selected: true, index: 1},
        { value: 'Other', selected: false, index: 2}
      ],
      hairOptions: [
        { value: 'Brown', selected: true, index: 0},
        { value: 'Red', selected: false, index: 1},
        { value: 'Black', selected: false, index: 2},
        { value: 'Grey', selected: false, index: 3},
        { value: 'Blonde', selected: false, index: 4},
        { value: 'Other', selected: false, index: 5}
      ]
    }
  }

  static propTypes = {
    dismiss: PropTypes.func
  }

  componentDidMount() {

  }

  _selectJob = (index) => {
    OptionView.selected(this.state.jobOptions, index, (arr) => {
      this.setState({ jobOptions: arr });
    });
  }

  _selectGender = (index) => {
    OptionView.selected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr });
    });
  }

  _selectHairColor = (index) => {
    OptionView.selected(this.state.hairOptions, index, (arr) => {
      this.setState({ hairOptions: arr });
    });
  }

  optionSelected(arr, index, callback) {
    if(arr[index].selected) {
      arr[index].selected = false;
    } else {
      for(let i = 0; i < arr.length; i++) {
        arr[i].selected = false;
      }
      arr[index].selected = true;
    }
    callback(arr);
  }

  sortFilters() {
    // sort filters here, then pass to this.props.dismiss()
    this.props.dismiss();
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={styles.topBar} >
          <TouchableOpacity style={styles.leftButton} onPress={() => this.props.dismiss()}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.sortFilters()} style={styles.rightButton} >
            <Text style={styles.text}>Apply</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container} >

          <Text style={styles.titleText}>Job Title</Text>
          <View style={styles.optionContainer} >
            <OptionViewSplit options={this.state.jobOptions} selectOption={(index) => this._selectJob(index)} />
          </View>

          <Text style={styles.titleText}>Gender</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.genderOptions} selectOption={(index) => this._selectGender(index)} />
          </View>

          <Text style={styles.titleText}>Hair Color</Text>
          <View style={styles.optionContainer} >
            <OptionView options={this.state.hairOptions} selectOption={(index) => this._selectHairColor(index)} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

// change margins based on screen size
const FRAME = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  optionContainer: {
    flex: 1,
    marginLeft: 16, marginRight: 16, marginBottom: 16,
  },
  genderOptionContainer: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  jobOptionContainer: {
    marginLeft: 16, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  titleText: {
    marginLeft: 24, marginBottom: 24,
    fontSize: 16,
    color: 'black', fontFamily: 'roboto-regular'
  },
  topBar: {
    height: (FRAME.height === 812) ? 96 : 64,
    marginBottom: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftButton: {
    marginLeft: 16, marginTop: (FRAME.height === 812) ? 48 : 24,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rightButton: {
    marginRight: 16, marginTop: (FRAME.height === 812) ? 48 : 24,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 16,
    padding: 22,
    textAlign: 'center',
    color: 'black', fontFamily: 'roboto-bold'
  }
})

var mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(FilterModal);
