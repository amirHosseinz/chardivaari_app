import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import RequestsListHeader from './RequestsListHeader';
import RequestRow from './RequestRow';

class RequestsListScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      requests: [],
    };
  }

  componentWillMount() {
    initRequests = [
      {
        'request': {
          id: 1,
          'listingTitle': 'ویلای شمال',
          'status': 'waitingHostConfirm',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'علی احمدی',
          'description': '',
        },
      },
      {
        'request': {
          id: 2,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 3,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 4,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingHostConfirm',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 5,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 6,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 7,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 8,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 9,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingHostConfirm',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 10,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 11,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 12,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingHostConfirm',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 13,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 14,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 15,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingHostConfirm',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 16,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
      {
        'request': {
          id: 17,
          'listingTitle': 'خونه‌ی دریا کنار',
          'status': 'waitingForPayment',
          'checkIn': '1396-10-11',
          'checkOut': '1396-10-13',
          'length': 2,
          'people': 5,
          'price': 35400,
          'partyName': 'آق غلام',
          'description': '',
        },
      },
    ];

    this.setState({
      requests: initRequests,
    });
  }

  _keyExtractor = (item, index) => item.request.id;

  renderRequest({item}, navigation) {
    return(
      <RequestRow
        requestItem={item}
        navigation={navigation}
        role={this.props.role}
      />
    );
  }

  render(){
    return(
      <View style={styles.container} >
        <RequestsListHeader count={5} />
        <FlatList
          data={this.state.requests}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderRequest(item, this.props.navigation)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 70,
    backgroundColor: '#F5FCFF',
  },
});

export default RequestsListScreen;
