import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';

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
            <Image style={styles.profilePic} source={require('../../assets/images/chef1.png')}></Image>
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

});

export default ProfileScreen;
