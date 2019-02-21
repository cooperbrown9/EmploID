import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { connect } from 'react-redux';

import DiscountModal from './DiscountModal';
import RoundButton from '../ui-elements/round-button';

import * as Colors from '../constants/colors';

import { getDiscountsByPlaces } from '../api/api';

class MyDiscountScreen extends Component {
  static propTypes = {
    onDismiss: PropTypes.func
  }

  constructor() {
    super()

    this.getDiscountsByPlaces = getDiscountsByPlaces.bind(this);

    this.state = {
      discountPresented: false,
      discountToPresent: { role: 0 },
      discounts: [{ _id: '', name: '', offer: '' }]
    }
  }

  componentDidMount() {
    this.getDiscounts();
  }

  onSelectDiscount = (discount) => {
    // discount.role = this.findMyRole(discount)
    // COMBAK the above is commented out because it errors bc 3 modals are present
    //      if a user tries to edit the presented discount
    discount.role = 0;
    this.setState({ discountToPresent: discount, discountPresented: true })
  }

  findMyRole = (discount) => {
    let loc = this.props.user.myLocations.find((loc) => loc._id === discount.place_id)
    return loc.relation.role;
  }

  _renderItem = ({ item }) => {
    return(
      <TouchableOpacity style={styles.discountItem} onPress={() => this.onSelectDiscount(item)} >
        <View style={styles.discountInfo}>
          <Text style={{fontSize: 24, marginBottom: 6, fontFamily: 'roboto-bold'}}>{item.name} </Text>
          <Text style={{fontSize: 18, color: 'gray', fontFamily: 'roboto-bold'}}>{item.offer}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  getDiscounts() {
    let placeIDs = [];
    this.props.user.myLocations.forEach((loc) => {
      placeIDs.push({ placeID: loc._id })
    })

    let sender = {
      'places': placeIDs
    }

    this.getDiscountsByPlaces(sender, (err, discounts) => {
      if(err) {
        console.log(err.message)
      } else {
        console.log(discounts)
        this.checkPermissions(discounts)
      }
    })
  }

  checkPermissions(discounts) {
    let eligibleDiscounts = [];
    discounts.forEach((discount) => {
      let locOfDiscount = this.props.user.myLocations.find((loc) => loc._id === discount.place_id)
      if(locOfDiscount.relation.role < 1 && discount.exclusive) {
        return;
      }
      eligibleDiscounts.push(discount)
    })
    this.setState({ discounts: eligibleDiscounts })
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={styles.titleContainer} >
          <Text style={styles.titleText}>Discounts</Text>
        </View>

        <View style={styles.listContainer} >
        {(this.state.discounts.length > 0)
          ? <FlatList
              data={this.state.discounts}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          : null
        }
        </View>

        <View style={styles.close} >
          <RoundButton imagePath={require('../../assets/icons/cancel.png')} onPress={this.props.onDismiss} />
        </View>

        <Modal animationType={'slide'} visible={this.state.discountPresented} >
          <DiscountModal
          myRole={this.state.discountToPresent.role}
          dismiss={() => this.setState({ discountPresented: false })}
          discount={this.state.discountToPresent}
        />
        </Modal>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  titleContainer: {
    backgroundColor: Colors.BLUE, height: 100,
    justifyContent: 'center'
  },
  titleText: {
    fontFamily: 'roboto-bold', fontSize: 32, color: 'white',
    position: 'absolute', left: 32, bottom: 12
  },
  listContainer: {
    flex: 1, marginTop: 8
  },
  discountItem: {
      flex: 1,
      height: 100, marginTop: 8, marginBottom: 8, borderRadius: 4, marginLeft: 16, marginRight: 16,
      alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row',
      backgroundColor: 'white',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 4
  },
  discountInfo: {
    flex: 3,
    flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 20
  },
  close: {
    position: 'absolute',
    left: 16, bottom: 16, height: 64, width: 64
  }
})

var mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(MyDiscountScreen);
