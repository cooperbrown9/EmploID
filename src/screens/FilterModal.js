import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import OptionView from '../ui-elements/option-view';
// import Slider from 'react-native-multi-slider';
// import MultiSlider from 'react-native-multi-slider';

class FilterModal extends Component {

  constructor() {
    super();

    this.state = {
      jobOptions: [
        {value: 'Head Chef', selected: true, index: 0},
        {value: 'Shift Leader', selected: false, index: 1},
        { value: 'Server', selected: false, index: 2},
        { value: 'General Manager', selected: false, index: 3}
      ],
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
    }
  }

  static propTypes = {
    dismiss: PropTypes.func
  }

  componentDidMount() {

  }

  _selectJob = (index) => {
    this.optionSelected(this.state.jobOptions, index, (arr) => {
      this.state({ jobOptions: arr });
    });
  }

  _selectGender = (index) => {
    this.optionSelected(this.state.genderOptions, index, (arr) => {
      this.setState({ genderOptions: arr });
    });
  }

  _selectHairColor = (index) => {
    this.optionSelected(this.state.hairOptions, index, (arr) => {
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
          <TouchableOpacity style={styles.leftButton} >
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.sortFilters()} style={styles.rightButton} >
            <Text style={styles.text}>Apply</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.titleText}>Job Title</Text>
        <View style={styles.jobOptionContainer} >
          <OptionView options={this.state.jobOptions} selectOption={(index) => this._selectJob(index)} />
        </View>

        <Text style={styles.titleText}>Gender</Text>
        <View style={styles.genderOptionContainer} >
          <OptionView options={this.state.genderOptions} selectOption={(index) => this._selectGender(index)} />
        </View>

        <Text style={styles.titleText}>Hair Color</Text>
        <View style={styles.optionContainer} >
          <OptionView options={this.state.hairOptions} selectOption={(index) => this._selectHairColor(index)} />
        </View>
      </View>
    )
  }
}

// change margins based on screen size
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  optionContainer: {
    flex: 1,
    marginLeft: 32, marginRight: 16, marginBottom: 16,
  },
  genderOptionContainer: {
    marginLeft: 32, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  jobOptionContainer: {
    marginLeft: 32, marginRight: 16, marginBottom: 16,
    flex: 1,
  },
  titleText: {
    marginLeft: 32, marginBottom: 16,
    fontSize: 16,
    color: 'black'
  },
  topBar: {
    height: 64,
    marginBottom: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftButton: {
    marginLeft: 16,
    justifyContent: 'center',

  },
  rightButton: {
    marginRight: 16,
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    padding: 22,
    textAlign: 'center',
    color: 'black'
  }
})

var mapStateToProps = state => {
  return {
    ...state,
    fontLoaded: state.setup.fontLoaded
  }
}

export default connect(mapStateToProps)(FilterModal);
