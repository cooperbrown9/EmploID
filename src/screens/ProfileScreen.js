import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Modal} from 'react-native';
import { connect } from 'react-redux';
import TabBar from '../ui-elements/employee-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';
import * as API from '../api/api';

import DiscountsTab from './employee-tabs/discounts-tab.js';
import LocationsTab from './employee-tabs/locations-tab.js';
import NotesTab from './employee-tabs/notes-tab.js';
import ProfileTab from './employee-tabs/profile-tab.js';
import EmployeeForm from './EmployeeForm.js'
import * as NavActions from '../action-types/nav-action-types';
import * as ProfileActions from '../action-types/employee-profile-action-types';




class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    formModal: false,
    places: [],
    name: null
  }

  componentDidMount () {
    // API.getPlacesFromEmployee(this.props.employeeID, (err, response) => {
    //   if(err){
    //     console.log(err);
    //
    //   } else {
    //     console.log(response);
    //     this.setState({places: response});
    //   }
    //
    // });

    this.getEmployeePlaces();
    this.getEmployee();

    // API.getEmployee(this.props.employeeID, (err, response) => {
    //   if(err){
    //     console.log(err);
    //   } else {
    //     console.log(response);
    //     this.setState({name: response.name});
    //   }
    // });

    console.log(this.props.employeeID);
  }

  getEmployee() {
    API.getEmployee(this.props.employeeID, (err, response) => {
      if(err){
        console.log(err);
      } else {
        console.log(response);
        this.setState({name: response.name});
      }
    });
  }

  getEmployeePlaces() {
    API.getPlacesFromEmployee(this.props.employeeID, (err, response) => {
      if(err){
        console.log(err);

      } else {
        console.log(response);
        this.setState({places: response});
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
            <Image style={styles.profilePic} source={require('../../assets/images/chef1.png')}/>


            <View style={styles.backButton}>
                <RoundButton onPress={() => this._goBack()} imagePath={require('../../assets/icons/back.png')}/>
              </View>
              <View style={styles.optionsButton}>
                <RoundButton onPress={this._presentFormModal} imagePath={require('../../assets/icons/ellipsis.png')}/>
              </View>
            

            <Text style={{fontSize: 34, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 130, left: 24}}>{this.state.name}</Text>
            <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 70, left: 24}}>Mega TOKER</Text>
            <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 44, left: 24}}>509.420.6969</Text>
          </View>
          <View style={{height: 60, paddingBottom: 8}}>
            <TabBar />
          </View>
          <View style={styles.screenContainer} >

         {(this.props.indexOn === 0)
            ? <ProfileTab  />
            : (this.props.indexOn === 1)
              ? <LocationsTab places={this.state.places}/>
              : (this.props.indexOn === 2)
                ? <DiscountsTab />
              : (this.props.indexOn === 3)
                  ? <NotesTab />
                : null
          }

          </View>
        </ScrollView>
        <Modal animationType={'slide'} transparent={false} visible={this.state.formModal} styles={{marginTop: 0}}>
          <EmployeeForm edit={true} dismiss={this._dismissFormModal}/>
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
    indexOn: state.emp.indexOn,
    employeeID: state.emp.employeeID,
    isOwner: state.user.isOwner
  }
}

export default connect(mapStateToProps)(ProfileScreen);
