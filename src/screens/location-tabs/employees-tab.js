import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, ListView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

import ProgressiveImage from '../../ui-elements/progressive-image';
// import { PreloadedImage }

import * as Colors from '../../constants/colors';

function findPositions(relation) {
  if(relation.role == 2) {
    return 'Owner'
  }

  if(relation.role == 1) {
    return 'Manager'
  }

  let s = '';
  relation.positions.forEach((p) => {
    s += (p + ' • ')
  })
  return s.substr(0, s.length-2)
}

function getPositions(relation) {
  if(relation.role == 2) {
    return ['Owner']
  }

  if(relation.role == 1) {
    return ['Manager']
  }

  let positions = []
  relation.positions.forEach((p) => {
    positions.push(p)
  })
  return positions
  // return s.substr(0, s.length-2)
}

const EmployeesTab = (props) => (
    <View style={styles.container}>

      {props.employees.map(model =>
        <TouchableOpacity
          style={styles.employeeItem} key={model._id}
          onPress={() => props.onPress(model)}
        >
          <Image style={styles.employeeImage} source={(model.image_url !== "" && model.image_url != null ) ? { uri: model.image_url } : require('../../../assets/images/chef1.png')} />
          {/*<ProgressiveImage
            style={styles.employeeImage}
            thumbnailSource={(model.image_url == "") ? require('../../../assets/images/chef1.png') : {uri:model.image_url}}
            source={(model.image_url == "") ? require('../../../assets/images/chef1.png') : {uri:model.image_url}}
          />*/}
          <View style={styles.employeeInfo}>
            <Text style={{fontSize: 24, marginBottom: 6, fontFamily: 'roboto-bold'}} numberOfLines={0}>{model.first_name} {model.last_name}</Text>

            <Text style={styles.positionText} numberOfLines={0}>{findPositions(model.relation)}</Text>



          </View>
          {(model.relation.role === 1 || model.relation.role === 2)
            ? <View style={{position:'absolute',right:8,bottom:8,width:16,justifyContent:'center',alignItems:'center'}}>
                <Image style={{height: 16,width:16,tintColor:Colors.BLUE}} source={require('../../../assets/icons/crown.png')} resizeMode={'contain'} />
              </View>
            : null
          }
        </TouchableOpacity>
      )}

    </View>
)

EmployeesTab.propTypes = {
  employees: PropTypes.array,
  onPress: PropTypes.func
}

EmployeesTab.defaultProps = {
  employees: [],
  onPress: () => {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 8, marginLeft: 8,
    shadowColor: 'black', shadowOffset: {width: 0, height: 8}, shadowRadius: 8, shadowOpacity: 0.2,
  },
  employeeImage: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    backgroundColor: Colors.BACKGROUND_GREY
  },
  positionText: {
    fontSize: 18,
    color: 'gray', fontFamily: 'roboto-bold'
  },
  positionView: {
    backgroundColor: Colors.MID_GREY, height: 32, borderRadius: 4,
    color: 'white', fontFamily: 'roboto-bold', fontSize: 18,
    margin: 4
  },
  employeeItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden'
  },
  employeeItemManager: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden',
      // borderRightWidth: 16, borderColor: Colors.BLUE
  },
  employeeItemOwner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: 'white',
      height: 100, borderRadius: 4,
      marginTop: 4, marginBottom: 4,
      backgroundColor: 'white',
      overflow: 'hidden',
      // borderRightWidth: 16, borderColor: Colors.BLUE
  },
  employeeInfo: {
    flex:3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 16, marginRight: 16
  }
});

var mapStateToProps = state => {
  console.log(state.detail.employees[0])
  return {
    employees: state.detail.employees
  }
}

export default connect(mapStateToProps)(EmployeesTab);
