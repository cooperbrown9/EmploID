import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import OptionView from '../ui-elements/option-view';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

class CreateDiscountForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      deleteText: 'DELETE',
      deleteCount: 0,
      exclusiveOptions: [
        { value: 'MANAGEMENT', selected: true, index: 0 },
        { value: 'EMPLOYEES', selected: false, index: 1 }
      ]
    }
  }

  static propTypes = {
    dismiss: PropTypes.func,
    edit: PropTypes.func,
    discount: PropTypes.object
  }

  static defaultProps = {
    edit: false
  }

  componentDidMount() {
    if(this.props.edit) {
      this.setState({ name: this.props.discount.name, description: this.props.discount.offer }, () => {
        this.optionSelected((this.props.discount.exclusive) ? 0 : 1);
      })
    }
  }

  createDiscount = () => {
    let exclusive = this.state.exclusiveOptions[0].selected;
    let discountData = {
      "name": this.state.name,
      "offer": this.state.description,
      "placeID": this.props.locationID,
      "exclusive": exclusive
    };

    API.createDiscount(discountData, (err, response) => {
      if(err) {
        console.log(err);
      } else {
        console.log(response);
        this.props.dismiss();
      }
    });
  }

  editDiscount = () => {
    let exclusive = this.state.exclusiveOptions[0].selected;
    var data = {
      "discountID": this.props.discount._id,
      "name": this.state.name,
      "offer": this.state.description,
      "placeID": this.props.locationID,
      "exclusive": exclusive
    }

    API.updateDiscount(data, (e1, discount) => {
      if(e1) {
        console.log(e1);
      } else {
        console.log(discount);
        this.props.dismiss();
      }
    })
  }

  deleteDiscount() {
    if(this.state.deleteCount === 0) {
      this.setState({ deleteText: 'Click again to confirm', deleteCount: ++this.state.deleteCount });
    } else {
      API.deleteDiscount(this.props.discount._id, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          this.props.dismiss();
        }
      })
    }
  }

  optionSelected = (index) => {
    OptionView.selectedExclusive(this.state.exclusiveOptions, index, (arr) => {
      this.setState({ exclusiveOptions: arr });
    });
  }

  textInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={value}
      />
    )
  }

  render() {
    return(
      <View style={styles.mainContainer} >
        <View style={styles.backButton} >
          <RoundButton imagePath={require('../../assets/icons/down.png')} onPress={this.props.dismiss} />
        </View>
        <ScrollView style={styles.scrollContainer} >
          <View style={styles.container} >


            <Text style={styles.textHeader}>Name</Text>
            <View style={styles.inputView}>
              {this.textInputFactory('Name', (text) => this.setState({ name: text }), this.state.name)}
            </View>


            <Text style={styles.textHeader}>Description</Text>
            <View style={styles.inputView} >
              {this.textInputFactory('Description', (text) => this.setState({ description: text }), this.state.description)}
            </View>

            <Text style={styles.textHeader}>Access to the discount</Text>
            <View style={styles.optionContainer} >
              <OptionView
                options={this.state.exclusiveOptions}
                selectOption={(index) => this.optionSelected(index)}
              />
            </View>

          </View>

          <View style={styles.submitButton} >
            <SubmitButton
              title={(this.props.edit) ? 'UPDATE DISCOUNT' : 'CREATE DISCOUNT'}
              onPress={() => {(this.props.edit) ? this.editDiscount() : this.createDiscount()}}
            />
          </View>
          {(this.props.edit)
            ? <View style={styles.deleteButton}>
                <SubmitButton title={this.state.deleteText} onPress={() => this.deleteDiscount()} hasBGColor={true} bgColor={'red'} />
              </View>
            : null
          }

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, backgroundColor: Colors.BACKGROUND_GREY
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  backButton: {
    position: 'absolute', left:16,top: 40, zIndex: 100000
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16, marginTop: 144
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16,
    flex: 1,
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  input: {
    marginLeft: 16,
    fontSize: 18, fontFamily: 'roboto-regular',
    color: 'black'
  },
  submitButton: {
    marginTop: 64, marginLeft: 32, marginRight: 32
  },
  deleteButton: {
    marginTop: 16, marginLeft: 32, marginRight: 32, marginBottom: 32
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    sessionID: state.user.sessionID,
    userID: state.user.userID,
    locationID: state.detail.location._id
  }
}

export default connect(mapStateToProps)(CreateDiscountForm);
