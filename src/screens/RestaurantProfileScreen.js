import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Modal} from 'react-native';
import { connect } from 'react-redux';
import TabBar from '../ui-elements/restaurant-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';
import * as API from '../api/api';

import DiscountsTab from './employee-tabs/discounts-tab.js';
import LocationsTab from './employee-tabs/locations-tab.js';
import NotesTab from './employee-tabs/notes-tab.js';
import ProfileTab from './employee-tabs/profile-tab.js';
import EmployeeForm from './EmployeeForm.js';
import RestaurantForm from './RestaurantForm.js';

import * as NavActions from '../action-types/nav-action-types';


class RestaurantProfileScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    formModal: false,
    name: null,
    phoneNumber: null,
    email: null,
    address: null
  }

  componentDidMount() {
    API.getPlace(this.props.locationID, (err, response) => {
      if(err){
        console.log(err);
      } else {
        console.log(response);
        this.setState({name: response.name, phoneNumber: response.phone, email: response.email, address: response.address });
      }
    });
  }

  _dismissFormModal = () => {
    this.setState({formModal: false});
  }

  _presentFormModal = () => {
    this.setState({formModal: true});
  }

  _goBack = () => {
    this.props.dispatch({ type: NavActions.BACK});
  }

  render() {
    return (
      <View style={styles.container} >
        <ScrollView style={{flex:1}}>
          <View>
            <Image style={styles.profilePic} source={require('../../assets/images/rest-1.png')}/>
            <View style={styles.backButton}>
              <RoundButton onPress={() => this._goBack()} imagePath={require('../../assets/icons/back.png')}/>
            </View>
            <View style={styles.optionsButton}>
              <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
            </View>
            <Text style={{fontSize: 34, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 180, left: 24}}>{this.state.name}</Text>
            <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 100, left: 24}}>{this.state.phoneNumber}</Text>
            <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 74, left: 24}}>{this.state.address}</Text>
            <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 44, left: 24}}>{this.state.email}</Text>
          </View>
          <View style={{height: 60, paddingBottom: 8}}>
            <TabBar />
          </View>
          <View style={styles.screenContainer} >

         {(this.props.indexOn === 0)
              ? <ProfileTab />
            : (this.props.indexOn === 1)
                ? <DiscountsTab />
              : (this.props.indexOn === 2)
                  ? <NotesTab />
                : null
          }

          </View>
        </ScrollView>
        <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} styles={{marginTop: 0}}>
          <RestaurantForm edit={true} dismiss={this._dismissFormModal}/>
        </Modal>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  },
  profilePic: {
    height: Dimensions.get('window').height*(4/5),
  },
  backButton: {
    position: 'absolute', left: 20, top: 20,
  },
  optionsButton: {
    position: 'absolute', right: 20, top: 20,
  },
  tabContainer: {
    height: 64
  },


});

var mapStateToProps = state => {
  return {
    indexOn: state.restaurant.indexOn,
    locationID: state.restaurant.locationID
  }
}

export default connect(mapStateToProps)(RestaurantProfileScreen);
