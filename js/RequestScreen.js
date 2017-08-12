import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
 } from 'react-native';

class RequestScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      request: {},
      role: '',
    };
  }

  componentWillMount() {
    this.setState({
      request: this.props.navigation.state.params.request,
      role: this.props.navigation.state.params.role,
    });
  }

  renderDescription() {
    if (this.state.request.description === '') {
      return <Text style={styles.bodyText} > - </Text>;
    } else {
      return <Text style={styles.bodyText} >{this.state.request.description}</Text>;
    }
  }

  renderStatus() {
    if (this.state.request.status === 'waitingHostConfirm') {
      return <Text style={styles.headerStatusText} >در انتظار تایید صاحب‌خانه</Text>;
    } else if (this.state.request.status === 'waitingForPayment') {
      return <Text style={styles.headerStatusText} >در انتظار پرداخت مهمان</Text>;
    }
  }

  onMessageToUserButtonPress() {
    // TODO
    // get new message id from server
    imessage ={
      _id: 50,
      text: 'مکالمه در مورد خانه‌ی ' + this.state.request.listingTitle,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };
    this.props.navigation.navigate(
      'conversationScreen',
      {
        partyName: this.state.request.partyName,
        message: imessage,
      });
  }

  onCancelRequestButtonPress() {
    Alert.alert('cancel request.');
  }

  onAcceptRequestButtonPress() {
    Alert.alert('accept reauest.');
  }

  onRejectRequestButtonPress() {
    Alert.alert('reject request.');
  }

  onPayRequestButtonPress() {
    Alert.alert('confirm ' + this.state.request.price + ' payment request.');
  }

  renderAccRejButton() {
    if (this.state.role === 'host') {
      if (this.state.request.status === 'waitingHostConfirm') {
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
      if (this.state.request.status === 'waitingForPayment') {
        return(
          <View style={styles.buttonItemStyle} >
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
      if (this.state.request.status === 'waitingHostConfirm') {
        return(
          <View style={styles.buttonItemStyle} >
          <TouchableOpacity onPress={this.onCancelRequestButtonPress.bind(this)} style={styles.cancelButtonStyle} >
            <Text style={styles.bodyText} >
              لغو درخواست
            </Text>
          </TouchableOpacity>
          </View>
        );
      }
      if (this.state.request.status === 'waitingForPayment') {
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

  render() {
    return(
      <ScrollView style={styles.container} >

        <View style={styles.requestHeader} >
          <Text style={styles.headerText} >
            {this.state.request.listingTitle}
          </Text>
          {this.renderStatus()}
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >متقاضی: </Text>
            <Text style={styles.bodyText} >{this.state.request.partyName}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تاریخ ورود: </Text>
            <Text style={styles.bodyText} >{this.state.request.checkIn}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تاریخ خروج: </Text>
            <Text style={styles.bodyText} >{this.state.request.checkOut}</Text>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >قیمت: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.price}</Text>
              <Text style={styles.bodyText} > تومان</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >مدت اقامت: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.length}</Text>
              <Text style={styles.bodyText} > شب</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetails} >
          <View style={styles.requestDetailItem} >
            <Text style={styles.bodyText} >تعداد: </Text>
            <View style={{flexDirection: 'row-reverse',}}>
              <Text style={styles.bodyText} >{this.state.request.people}</Text>
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
