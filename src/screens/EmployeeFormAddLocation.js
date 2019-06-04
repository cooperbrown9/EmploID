import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

import OptionViewSplit from '../ui-elements/option-view-split';
import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';

class EmployeeFormAddLocation extends Component {

  constructor() {
    super();

    this.state = {
      places: [
        { name: 'ABC', _id: '123', selected: false, index: 0 },
        { name: 'DEF', _id: '456', selected: false, index: 1 }
      ],
      positionOptions: [
        { value: 'Server', selected: false, index: 0 },
        { value: 'Bartender', selected: false, index: 1 },
        { value: 'Host', selected: false, index: 2 },
        { value: 'Support', selected: false, index: 3 },
        { value: 'Manager', selected: false, index: 4 },
        { value: 'Chef', selected: false, index: 5 },
        { value: 'Cook', selected: false, index: 6 },
        { value: 'Dishwasher', selected: false, index: 7 }
      ],
      selectedPlaces: [],
      isFirstOpen: [true]
    }

  }

  static propTypes = {
    dismiss: PropTypes.func,
    addLocations: PropTypes.func,
    places: PropTypes.array,
  }

  componentWillMount() {
    this.state.places = this.props.places;

    // this is a fix because the state persists after closing the modal,
    // so its a workaround for initializing the data.
    // this initializing (i.e. building position objects) should be done elsewhere
    if(this.state.places[0].positions[0].value == null) {
      for(let i = 0; i < this.state.places.length; i++) {
        this.state.places[i].selected = false;
        this.state.places[i].index = i;
        this.state.places[i].animation = 1;
      }

      this.state.positionOptions = [];
      this.state.places.forEach((place, index) => {
        place.positions.forEach((position, indexPos) => {
          place.positions[indexPos] = { value: place.positions[indexPos], selected: false, index: indexPos }
        })
      });

      this.setState({ places: this.state.places, isFirstOpen: [false] });
    } else {
      this.setState({ places: this.state.places })
    }
  }

  positionSelected = (index, place) => {
    place.positions[index].selected = !place.positions[index].selected;
    for(let i = 0; i < this.state.places.length; i++) {
      if(this.state.places[i]._id === place._id) {
        this.state.places[i] = place;
        break;
      }
    }
    this.setState({ places: this.state.places });
  }

  selectPlace = (place) => {
    var animationProps = {
      type: 'timing',
      // springDamping: 0.8,
      property: 'opacity'
    }

    var animationConfig = {
      duration: 250,
      create: animationProps,
      update: animationProps
    }
    LayoutAnimation.configureNext(animationConfig);

    this.state.places[place.index].selected = !this.state.places[place.index].selected;
    this.setState({ places: this.state.places });
  }

  submit() {
    let selectedPlaces = [];
    for(let i = 0; i < this.state.places.length; i++) {

      // if place is selected, find the position selected for it
      if(this.state.places[i].selected) {
        // loop thru selected place's positions
        let positions = [];
        this.state.places[i].positions.forEach((pos) => {
          if(pos.selected) {
            positions.push(pos.value);
          }
        });
        selectedPlaces.push({ 'place_id': this.state.places[i]._id, 'positions': positions });
      }
    }
    this.props.addLocations(selectedPlaces);
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
            {(this.state) ? this.state.places.map((place) => (
              <Animated.View style={(place.selected) ? [styles.placeContainerOn, {flex: place.animation}] : styles.placeContainerOff} key={place._id} >
                <TouchableOpacity
                  onPress={() => this.selectPlace(place) }
                  style={[styles.buttonOff, (place.selected) ? styles.buttonOn : {}]}
                  key={place._id} >
                  <Text style={[styles.textOff, (place.selected) ? styles.textOn : {}]} >
                    {place.name}
                  </Text>
                </TouchableOpacity>
                {(place.selected)
                  ? <View style={styles.optionContainer} >
                      <OptionViewSplit options={place.positions} selectOption={(index) => this.positionSelected(index, place)} />
                    </View>
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
  placeContainerOff: {
    flex: 1, borderRadius: 8,
    marginLeft: 12, marginRight: 12, marginBottom: 64,
    backgroundColor: Colors.MID_GREY,
    overflow: 'hidden'
  },
  placeContainerOn: {
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
    places: state.user.myLocations.filter((loc) => {
      return loc.relation.role >= 1;
    })
  }
}

export default connect(mapStateToProps)(EmployeeFormAddLocation);
