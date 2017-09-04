import React, { Component } from 'react';
import {
  View,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CacheStore from 'react-native-cache-store';

import { testURL, productionURL } from './data';

class BookedRequestScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      bookedRequest: {},
      token: null,
      username: null,
    };
  }

  componentWillMount () {
    this.setState({
      bookedRequest: this.props.navigation.state.params.bookedRequest,
    });
    // load token and username from CacheStore
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  setToken (token) {
    this.setState({
      token
    });
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  renderStatus() {
    if (this.state.bookedRequest.status === 'IN_PROGRESS') {
      return <Text style={styles.headerStatusText}>در حال انجام</Text>;
    } else if (this.state.bookedRequest.status === 'ISSUED') {
      return <Text style={styles.headerStatusText}>در حال بررسی برای حل اختلاف</Text>;
    }
  }

  onMessageToUserButtonPress () {
      fetch(productionURL + '/api/message/compose/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          sender: this.state.username,
          recipient: this.state.bookedRequest.guest_person,
          subject: 'رزرو خانه‌ی ' + this.state.bookedRequest.room.title,
          body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.bookedRequest.room.title,
        }),
      })
      .then((response) => this.onResponseRecieved (response))
      .catch((error) => {
        console.error(error);
      });
  }

  onResponseRecieved (response) {
    body = JSON.parse(response._bodyText);
    if (response.status === 200) {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          partyName: this.state.bookedRequest.guest_person,
          messageId: body.message_id,
          username: this.state.username,
        }
      );
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  renderAccRejButton () {
      if (this.state.bookedRequest.status === 'IN_PROGRESS') {
        return(
          <View style={styles.buttonItemStyle}>
          <TouchableOpacity onPress={this.onCancelRequestButtonPress.bind(this)} style={styles.cancelButtonStyle}>
            <Text style={styles.bodyText}>
              لغو درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
  }

  onCancelRequestButtonPress() {
    Alert.alert('cancel request.');
  }

  render () {
    return(
      <ScrollView style={styles.container}>

      <View style={styles.bookedRequestHeader}>
        <Text style={styles.headerText}>
          {this.state.bookedRequest.room.title}
        </Text>
        {this.renderStatus()}
      </View>

      <View style={styles.bookedRequestDetails} >
        <View style={styles.bookedRequestDetailItem} >
          <Text style={styles.bodyText} >مهمان: </Text>
          <Text style={styles.bodyText} >{this.state.bookedRequest.guest_person}</Text>
        </View>
      </View>

      <View style={styles.bookedRequestDetails}>
        <View style={styles.bookedRequestDetailItem}>
          <Text style={styles.bodyText} >تاریخ ورود: </Text>
          <Text style={styles.bodyText} >{this.state.bookedRequest.start_date}</Text>
        </View>
      </View>

      <View style={styles.bookedRequestDetails}>
        <View style={styles.bookedRequestDetailItem}>
          <Text style={styles.bodyText} >تاریخ خروج: </Text>
          <Text style={styles.bodyText} >{this.state.bookedRequest.end_date}</Text>
        </View>
      </View>

      <View style={styles.bookedRequestDetails}>
        <View style={styles.bookedRequestDetailItem}>
          <Text style={styles.bodyText} >قیمت: </Text>
          <View style={{flexDirection: 'row-reverse',}}>
            <Text style={styles.bodyText} >{this.state.bookedRequest.total_price}</Text>
            <Text style={styles.bodyText} > تومان</Text>
          </View>
        </View>
      </View>

      <View style={styles.bookedRequestDetails} >
        <View style={styles.bookedRequestDetailItem} >
          <Text style={styles.bodyText} >تعداد: </Text>
          <View style={{flexDirection: 'row-reverse',}}>
            <Text style={styles.bodyText} >{this.state.bookedRequest.number_of_guests}</Text>
            <Text style={styles.bodyText} > نفر</Text>
          </View>
        </View>
      </View>

      {this.renderAccRejButton()}

      <View style={styles.buttonItemStyle}>
      <TouchableOpacity
        onPress={this.onMessageToUserButtonPress.bind(this)}
        style={styles.messageButtonStyle}>
        <Text style={styles.bodyText}>
          پیام به کاربر
        </Text>
      </TouchableOpacity>
      </View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  bookedRequestHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fdf5e6',
    padding: 20,
  },
  headerText: {
    fontSize: 23,
    color: '#cd853f',
  },
  headerStatusText: {
    fontSize: 15,
    color: '#cd853f',
  },
  bookedRequestDetails: {
    flex: 1,
  },
  bookedRequestDetailItem: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
  },
  bodyText: {
    fontSize: 18,
    color: 'black',
  },
  buttonItemStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  messageButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  cancelButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default BookedRequestScreen;
