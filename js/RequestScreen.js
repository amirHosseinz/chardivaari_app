import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
 } from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';

import { testURL, productionURL } from './data';

class RequestScreen extends Component {
  constructor (props) {
    super (props);
    this.state={
      request: {},
      role: '',
      token: '',
      username: '',
    };
  }

  componentWillMount() {
    this.setState({
      request: this.props.navigation.state.params.request,
      role: this.props.navigation.state.params.role,
    });
    // load token and username from CacheStore
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  backNavigation () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
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

  renderDescription() {
    if (this.state.request.description === '') {
      return <Text style={styles.bodyText} > - </Text>;
    } else {
      return <Text style={styles.bodyText} >{this.state.request.description}</Text>;
    }
  }

  renderStatus () {
    if (this.state.request.status === 'WAIT_FOR_HOST') {
      return <Text style={styles.headerStatusText} >در انتظار تایید صاحب‌خانه</Text>;
    } else if (this.state.request.status === 'WAIT_FOR_GUEST_PAY') {
      return <Text style={styles.headerStatusText} >در انتظار پرداخت مهمان</Text>;
    }
  }

  onMessageToUserButtonPress () {
    if (this.state.role === 'guest') {
      fetch(productionURL + '/api/message/compose/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          sender: this.state.username,
          recipient: this.state.request.room.owner,
          subject: 'رزرو خانه‌ی ' + this.state.request.room.title,
          body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.request.room.title,
        }),
      })
      .then((response) => this.onResponseRecieved(response))
      .catch((error) => {
        Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
      });
    } else {
      fetch(productionURL + '/api/message/compose/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          sender: this.state.username,
          recipient: this.state.request.guest_person,
          subject: 'رزرو خانه‌ی ' + this.state.request.room.title,
          body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.room.title,
        }),
      })
      .then((response) => this.onResponseRecieved(response))
      .catch((error) => {
        Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
      });
    }
  }

  onResponseRecieved (response) {
    var pName = '';
    if (this.state.role === 'guest') {
      pName = this.state.request.room.owner;
    } else {
      pName = this.state.request.guest_person;
    }
    body = JSON.parse(response._bodyText);
    if (response.status === 200) {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          partyName: pName,
          messageId: body.message_id,
          username: this.state.username,
        }
      );
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onCancelRequestButtonPress () {
    fetch(productionURL + '/api/request/cancel/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        request_id: this.state.request.id,
        role: this.state.role,
      }),
    })
    .then((response) => this.onCancelRequestResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onCancelRequestResponseRecieved (response) {
    if (response.status === 200) {
      this.backNavigation();
      Alert.alert('درخواست لغو گردید.');
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onAcceptRequestButtonPress () {
    fetch(productionURL + '/api/request/accept/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        request_id: this.state.request.id,
        role: this.state.role,
      }),
    })
    .then((response) => this.onAcceptRequestResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onAcceptRequestResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if ('error' in body) {
        Alert.alert('این تاریخ در دسترس نمی‌باشد.');
      } else {
        this.backNavigation();
        Alert.alert('درخواست پذیرفته شد.');
      }
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onRejectRequestButtonPress () {
    fetch(productionURL + '/api/request/reject/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        request_id: this.state.request.id,
        role: this.state.role,
      }),
    })
    .then((response) => this.onRejectRequestResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onRejectRequestResponseRecieved (response) {
    if (response.status === 200) {
      this.backNavigation();
      Alert.alert('درخواست رد گردید.');
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onPayRequestButtonPress () {
    fetch(productionURL + '/api/request/pay/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        request_id: this.state.request.id,
        role: this.state.role,
      }),
    })
    .then((response) => this.onPayRequestResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onPayRequestResponseRecieved (response) {
    if (response.status === 200) {
      this.backNavigation();
      Alert.alert('درخواست پرداخت گردید.');
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  renderAccRejButton () {
    if (this.state.role === 'host') {
      if (this.state.request.status === 'WAIT_FOR_HOST') {
        return (
          <View style={styles.accRejButtonItemStyle} >
          <TouchableOpacity onPress={this.onAcceptRequestButtonPress.bind(this)} style={styles.acceptButtonStyle} >
            <Text style={styles.bodyText} >
              پذیرش درخواست
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onRejectRequestButtonPress.bind(this)} style={styles.rejectButtonStyle} >
            <Text style={styles.bodyText} >
              رد کردن درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
      if (this.state.request.status === 'WAIT_FOR_GUEST_PAY') {
        return(
          <View style={styles.buttonItemStyle}>
          <TouchableOpacity onPress={this.onCancelRequestButtonPress.bind(this)} style={styles.cancelButtonStyle} >
            <Text style={styles.bodyText} >
              لغو درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
    }
    if (this.state.role === 'guest') {
      if (this.state.request.status === 'WAIT_FOR_HOST') {
        return(
          <View style={styles.buttonItemStyle}>
          <TouchableOpacity onPress={this.onCancelRequestButtonPress.bind(this)} style={styles.cancelButtonStyle} >
            <Text style={styles.bodyText}>
              لغو درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
      if (this.state.request.status === 'WAIT_FOR_GUEST_PAY') {
        return(
          <View style={styles.accRejButtonItemStyle} >
          <TouchableOpacity onPress={this.onPayRequestButtonPress.bind(this)} style={styles.acceptButtonStyle} >
            <Text style={styles.bodyText} >
              پرداخت
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onRejectRequestButtonPress.bind(this)} style={styles.rejectButtonStyle} >
            <Text style={styles.bodyText} >
              رد کردن درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
    }
  }

  render () {
    return(
      <ScrollView style={styles.container}>

        <View style={styles.requestHeader}>
          <Text style={styles.headerText}>
            {this.state.request.room.title}
          </Text>
          {this.renderStatus()}
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >متقاضی: </Text>
            <Text style={styles.bodyText} >{this.state.request.guest_person}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تاریخ ورود: </Text>
            <Text style={styles.bodyText} >{this.state.request.start_date}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تاریخ خروج: </Text>
            <Text style={styles.bodyText} >{this.state.request.end_date}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >قیمت: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.total_price}</Text>
              <Text style={styles.bodyText} > تومان</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >مدت اقامت: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.duration}</Text>
              <Text style={styles.bodyText} > شب</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تعداد: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.number_of_guests}</Text>
              <Text style={styles.bodyText} > نفر</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >توضیحات: </Text>
            {this.renderDescription()}
          </View>
        </View>

        {this.renderAccRejButton()}

        <View style={styles.buttonItemStyle} >
        <TouchableOpacity
          onPress={this.onMessageToUserButtonPress.bind(this)}
          style={styles.messageButtonStyle} >
          <Text style={styles.bodyText} >
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
  requestHeader: {
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
  bodyText: {
    fontSize: 18,
    color: 'black',
  },
  requestDetails: {
    flex: 1,
  },
  requestDetailItem: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
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
  accRejButtonItemStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
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
  acceptButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9acd32',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  rejectButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default RequestScreen;
