import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import TabBar from '../ui-elements/employee-tab-bar.js';
import RoundButton from '../ui-elements/round-button.js';

import DiscountsTab from './employee-tabs/discounts-tab.js';
import LocationsTab from './employee-tabs/locations-tab.js';
import NotesTab from './employee-tabs/notes-tab.js';
import ProfileTab from './employee-tabs/profile-tab.js';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {

  }

  render() {
    return (
      <View style={styles.container} >
        <ScrollView style={{flex:1}}>
          <View>
            <Image style={styles.profilePic} source={require('../../assets/images/chef1.png')}/>
            <View style={styles.backButton}>
              <RoundButton imagePath={require('../../assets/icons/back.png')}/>
            </View>
            <View style={styles.optionsButton}>
              <RoundButton imagePath={require('../../assets/icons/ellipsis.png')}/>
            </View>
            <Text style={{fontSize: 34, color: 'green', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 130, left: 24}}>Randy Savage</Text>
            <Text style={{fontSize: 16, color: 'green', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 70, left: 24}}>Mega TOKER</Text>
            <Text style={{fontSize: 16, color: 'green', fontWeight: 'bold',  backgroundColor: 'transparent', position: 'absolute', top: Dimensions.get('window').height*(4/5) - 44, left: 24}}>509.420.6969</Text>
          </View>
          <View style={styles.screenContainer} >
        {  // {(this.props.indexOn === 0)
          //   ? <ProfileTab  />
          //   : (this.props.indexOn === 1)
          //     ? <LocationsTab />
          //     : (this.props.indexOn === 2)
          //       ? <DiscountsTab />
          //     : (this.props.indexOn === 3)
          //         ? <NotesTab />
          //       : null
          // }
        }
            <LocationsTab/>
          </View>
        </ScrollView>

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
    editOpen: state.emp.editOpen
  }
}

export default connect(mapStateToProps)(ProfileScreen);
