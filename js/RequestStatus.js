import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import moment from 'moment-jalaali';

import PaymentModule from './common/payment/PaymentModule';
import { testURL, productionURL } from './data';


class RequestStatus extends Component {
  constructor (props) {
    super(props);
    this.state={
      request: {},
      role: null,
      token: null,
      username: null,
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

  backNavigation = () => {
    this.props.navigation.state.params.refresh();
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  renderStatus () {
    switch(this.state.request.status) {
    case 'WAIT_FOR_HOST':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>در انتظار تایید میزبان</Text>
        </View>
      );
      break;
    case 'GUEST_CANCELED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>لغو شده توسط مهمان</Text>
        </View>
      );
      break;
    case 'HOST_REJECTED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>لغو شده توسط میزبان</Text>
        </View>
      );
      break;
    case 'WAIT_FOR_GUEST_PAY':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>تایید نهایی و پرداخت</Text>
        </View>
      );
      break;
    case 'HOST_ACCEPTED_GUEST_CANCELED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>لغو شده توسط میهمان پس از پذیرش میزبان</Text>
        </View>
      );
      break;
    case 'HOST_ACCEPTED_HOST_CANCELED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>لغو شده توسط میزبان پس از پذیرش</Text>
        </View>
      );
      break;
    case 'HOST_ACCEPTED_GUEST_PAYED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}></Text>
        </View>
      );
      break;
    default:
    }
  }

  renderTitle () {
    if (this.state.request.room &&
      this.state.request.room.title != '') {
        return(
          <View>
            <View style={styles.cost}>
              <Text style={styles.costtext}>نام اقامتگاه: </Text>
              <Text style={styles.resulttextbold}>
                {this.state.request.room.title}
              </Text>
            </View>
            <View style={styles.divider}>
            </View>
          </View>
        );
      }
  }

  renderJalaliDate (date) {
    return moment(date, 'YYYY-M-DTHH:mm:ssZ').format('jYYYY/jM/jD');
  }

  renderCancelationDate () {
    if (this.state.request.canceled_date &&
      this.state.request.canceled_date != '') {
        return(
          <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}>تاریخ لغو: </Text>
            <Text style={styles.resulttextbold}>
              {this.renderJalaliDate(this.state.request.canceled_date)}
            </Text>
          </View>
        );
      }
  }

  onCancelRequestButtonPress = () => {
    Alert.alert(
      'لغو درخواست',
      'درخواست شما لغو شود؟',
      [
        {text: 'بله', onPress: () => {
          this.cancelRequest();
        },},
        {text: 'خیر', onPress: () => {},},
      ],
      { cancelable: false }
    );
  }

  cancelRequest () {
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

  onAcceptRequestButtonPress = () => {
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

  onRejectRequestButtonPress = () => {
    Alert.alert(
      'رد کردن درخواست',
      'درخواست را رد می‌کنید؟',
      [
        {text: 'بله', onPress: () => {
          this.rejectRequest();
        },},
        {text: 'خیر', onPress: () => {},},
      ],
      { cancelable: false }
    );
  }

  rejectRequest () {
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

  async asyncPayment () {
    try {
      var {
        isPaymentSuccess,
        refID,
      } = await PaymentModule.reactRequestPayment(
        'جهت تست درگاه',
        100,
        this.state.token,
        this.state.request.id
      );
      if (isPaymentSuccess) {
        Alert.alert('کد پیگیری: '+refID);
        // this.payRequestDone();
      }
    } catch (e) {
      console.log(e);
    }
  }

  payRequestDone = () => {
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

  onPayRequestPress = () => {
    this.asyncPayment();
    // this.backNavigation();
  }

  onPayRequestResponseRecieved (response) {
    if (response.status === 200) {
      this.backNavigation();
      Alert.alert('درخواست پرداخت گردید.');
    } else if (response.status === 203) {
      // NON_AUTHORITATIVE_INFORMATION
      Alert.alert('خطای اطلاعات ناقص');
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onContactToUserPress = () => {
    if (this.state.role === 'guest') {
      fetch(productionURL + '/api/message/compose/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          sender: this.state.request.guest_person.username,
          recipient: this.state.request.room.owner.username,
          subject: 'رزرو خانه‌ی ' + this.state.request.room.title,
          room_id: this.state.request.room.id,
          body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.request.room.title,
        }),
      })
      .then((response) => this.onResponseRecieved(response))
      .catch((error) => {
        // network error
        // console.log(error);
        Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
      });
    } else if (this.state.role === 'host') {
      fetch(productionURL + '/api/message/compose/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          sender: this.state.request.guest_person.username,
          recipient: this.state.request.room.owner.username,
          subject: 'رزرو خانه‌ی ' + this.state.request.room.title,
          room_id: this.state.request.room.id,
          body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.request.room.title,
        }),
      })
      .then((response) => this.onResponseRecieved(response))
      .catch((error) => {
        // network error
        // console.log(error);
        Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
      });
    }
  }

  onResponseRecieved (response) {
    if (this.state.role === 'host') {
      if (response.status === 200) {
        body = JSON.parse(response._bodyText);
        this.props.navigation.navigate(
          'conversationScreen',
          {
            party: this.state.request.guest_person,
            messageId: body.message_id,
            username: this.state.request.room.owner.username,
            room: this.state.request.room,
          }
        );
      } else {
        // TODO
        // error handle
        Alert.alert('خطایی رخ داده.');
      }
    } else if (this.state.role === 'guest') {
      if (response.status === 200) {
        body = JSON.parse(response._bodyText);
        this.props.navigation.navigate(
          'conversationScreen',
          {
            party: this.state.request.room.owner,
            messageId: body.message_id,
            username: this.state.request.guest_person.username,
            room: this.state.request.room,
          }
        );
      } else {
        // TODO
        // error handle
      }
    }
  }

  renderContactToUser () {
    if (this.state.role === 'host') {
      return(
        <View>
          <Text style={styles.resulttext}>پیرامون درخواست خود از میهمان سوال دارید؟</Text>
          <TouchableOpacity onPress={this.onContactToUserPress}>
            <Text style={styles.pmtohost}>ارسال پیام به میهمان</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.role === 'guest') {
      return(
        <View>
          <Text style={styles.resulttext}>پیرامون درخواست خود از میزبان سوال دارید؟</Text>
          <TouchableOpacity onPress={this.onContactToUserPress}>
            <Text style={styles.pmtohost}>ارسال پیام به میزبان</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderAcceptPayButton () {
    switch(this.state.request.status) {
    case 'WAIT_FOR_HOST':
      if (this.state.role === 'host') {
        return(
          <View style={styles.bottombarbutton}>
              <TouchableOpacity style={styles.buttontouch}
                onPress={this.onAcceptRequestButtonPress}>
                <View style={styles.buttonview}>
                <Text style={styles.reservebuttontext}>تایید درخواست</Text>
              </View>
              </TouchableOpacity>
          </View>
        );
      } else if (this.state.role === 'guest') {
        break;
      }
      break;
    case 'GUEST_CANCELED':
      break;
    case 'HOST_REJECTED':
      break;
    case 'WAIT_FOR_GUEST_PAY':
      if (this.state.role === 'host') {
        break;
      } else if (this.state.role === 'guest') {
        return(
          <View style={styles.bottombarbutton}>
              <TouchableOpacity style={styles.buttontouch} onPress={this.onPayRequestPress}>
                <View style={styles.buttonview}>
                <Text style={styles.reservebuttontext}>پرداخت</Text>
              </View>
              </TouchableOpacity>
          </View>
        );
      }
      break;
    case 'HOST_ACCEPTED_GUEST_CANCELED':
      break;
    case 'HOST_ACCEPTED_HOST_CANCELED':
      break;
    case 'HOST_ACCEPTED_GUEST_PAYED':
      break;
    default:
    }
  }

  renderRejectCancelButton () {
    switch (this.state.request.status) {
      case 'WAIT_FOR_HOST':
        if (this.state.role === 'host') {
          return(
            <View style={styles.bottombarbutton}>
                <TouchableOpacity style={styles.buttontouch1} onPress={this.onRejectRequestButtonPress}>
                  <View style={styles.buttonview1}>
                  <Text style={styles.reservebuttontext}>رد کردن درخواست</Text>
                </View>
                </TouchableOpacity>
            </View>
          );
        } else if (this.state.role === 'guest') {
          return(
            <View style={styles.bottombarbutton}>
                <TouchableOpacity style={styles.buttontouch1} onPress={this.onCancelRequestButtonPress}>
                  <View style={styles.buttonview1}>
                  <Text style={styles.reservebuttontext}>لغو کردن درخواست</Text>
                </View>
                </TouchableOpacity>
            </View>
          );
        }
        break;
      case 'GUEST_CANCELED':
        break;
      case 'HOST_REJECTED':
        break;
      case 'WAIT_FOR_GUEST_PAY':
        return(
          <View style={styles.bottombarbutton}>
              <TouchableOpacity style={styles.buttontouch1} onPress={this.onCancelRequestButtonPress}>
                <View style={styles.buttonview1}>
                <Text style={styles.reservebuttontext}>لغو درخواست</Text>
              </View>
              </TouchableOpacity>
          </View>
        );
        break;
      case 'HOST_ACCEPTED_GUEST_CANCELED':
        break;
      case 'HOST_ACCEPTED_HOST_CANCELED':
        break;
      case 'HOST_ACCEPTED_GUEST_PAYED':
        break;
      default:
    }
  }

  render () {
    return(
      <View style={styles.container0}>
        <View style={styles.container1}>
          <TouchableOpacity onPress={this.backNavigation}>
            <View style={styles.backbuttonview}>
            <Icon size={44} color="#3e3e3e" name="keyboard-arrow-right" />
          </View>
        </TouchableOpacity>
          {this.renderStatus()}
        <ScrollView>
          <View style={styles.costbox}>
            {this.renderTitle()}
            <View style={styles.tripincatch}>
            <Text style={styles.costtext}>میهمان: </Text>
            <Text style={styles.resulttextbold}>
              {this.state.request.guest_person.last_name}
            </Text>
            </View>
            <View style={styles.divider}>
            </View>
            <View style={styles.tripincatch}>
            <Text style={styles.costtext}>میزبان: </Text>
            <Text style={styles.resulttextbold}>
              {this.state.request.room.owner.last_name}
            </Text>
            </View>
            <View style={styles.divider}>
            </View>
            <View style={styles.interpersonresult}>
            <Text style={styles.resulttext}>تاریخ ورود: </Text>
              <Text style={styles.resulttextbold}>
                {this.renderJalaliDate(this.state.request.start_date)}
              </Text>
            </View>
            <View style={styles.interpersonresult}>
            <Text style={styles.resulttext}>تاریخ خروج: </Text>
              <Text style={styles.resulttextbold}>
                {this.renderJalaliDate(this.state.request.end_date)}
              </Text>
            </View>
            {this.renderCancelationDate()}
            <View style={styles.interpersonresult}>
            <Text style={styles.resulttext}>مدت اقامت: </Text>
              <Text style={styles.resulttextbold}>
                {this.state.request.duration}
              </Text>
              <Text style={styles.resulttextbold}> روز</Text>
            </View>
              <View style={styles.divider}>
              </View>
          </View>

          <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}>تعداد مسافران: </Text>
            <Text style={styles.resulttext}>
              {this.state.request.number_of_guests}
            </Text>
          </View>
          <View style={styles.divider}>
          </View>

          <View style={styles.interpersonresult}>
            <Text style={styles.costtextfinal}>هزینه قابل پرداخت: </Text>
            <Text style={styles.costtextfinal}>
              {this.state.request.total_price}
            </Text>
            <Text style={styles.costtextfinal}> تومان</Text>
          </View>
          <View style={styles.divider}>
          </View>

          {this.renderContactToUser()}
            <View  style={{marginBottom:25}}>
            </View>
          </ScrollView>

        </View>

        <View style={styles.bottombar}>
          <View style={styles.bottombarchild}>
            {this.renderRejectCancelButton()}
            {this.renderAcceptPayButton()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#ffffff',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('screen').width-50 ,
  },
  header:{
    justifyContent:'center',
    alignItems:'center',
  },
  h1:{
    fontSize:24,
    fontFamily:'Vazir-Medium',
    color:'#3e3e3e',
    marginTop:16,
    marginBottom:20,
  },
  interperson:{
    marginTop: 40,
  },
  interperson1:{
    flexDirection:'row-reverse',
    alignItems:'flex-start',
  },
  addtext:{
    color:'#00a9a6',
    fontFamily: 'Vazir-Medium',
    fontSize:18,
    marginRight:5,
  },
  interpersonresult:{
    alignItems: 'flex-start',
    flexDirection:'row-reverse',
  },
  resulttext:{
    fontFamily: 'Vazir-Light',
    fontSize:14,
    color:'#000000',
  },
  divider:{
    height: 2,
    width:Dimensions.get('window').width-50 ,
    backgroundColor: '#d7d7d7',
    marginTop: 12,
    marginBottom: 12,
  },
  costbox:{
    alignItems:'flex-end',
  },
  cost:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
  },
  tripincatch:{
    flexDirection:'row-reverse',
    alignItems: 'flex-start',
  },
  costtext:{
    fontFamily:'Vazir-Light',
    fontSize:14,
    color:'#000000',
  },
  interdiscount: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop:5,
  },
  discountresult:{
    flexDirection:'row-reverse'
  },
  distext:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#f56e4e',
  },
  disdetatiltext:{
    fontFamily:'Vazir-Light',
    fontSize:12,
    color:'#f56e4e',
  },
  bottombar: {
    width: Dimensions.get('screen').width,
    height:70,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent:"center",
  },
  bottombarchild: {
    width: Dimensions.get('screen').width-30,
    flex:1,
    flexDirection: "row-reverse",
    justifyContent:'space-between',
  },
  bottombarprice: {
    flex:3,
    flexDirection:"row-reverse",
    justifyContent:"flex-start",
    alignItems:'center',
    marginBottom:5,
  },
  bottombarbutton: {
    flex: 2,
    alignItems:'center',
    justifyContent:"center",
  },
  pricetext: {
    fontSize: 18,
    fontFamily:"Vazir-Medium",
    color: "#3e3e3e",
    justifyContent: "center",
    alignItems: "center",
  },
  pernighttext: {
    fontSize: 20,
    fontFamily:"Vazir-Medium",
    color: "#787878",
    justifyContent:"flex-end",
  },
  reservebuttontext: {
    fontSize: 16,
    fontFamily:"Vazir-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#00cecc",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: (Dimensions.get('screen').width-70)/2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttontouch1: {
    borderColor:"#bebebe",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: (Dimensions.get('screen').width-70)/2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttonview: {
    backgroundColor:"#00cecc",
    borderRadius: 50,
    height:40,
    width: (Dimensions.get('screen').width-86)/2,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  buttonview1: {
    backgroundColor:"#bebebe",
    borderRadius: 50,
    height:40,
    width: (Dimensions.get('screen').width-86)/2,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  checkcodetext:{
    fontFamily:'Vazir-Light',
    fontSize:14,
    color:'#00a8a6',
  },
  inputstyle:{
    width:60,
  },
  backbuttonview:{
    flexDirection:'row-reverse',
    marginTop:14,
  },
  resulttextbold:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#3e3e3e',
  },
  costtextfinal:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#f56e4e',
  },
  pmtohost:{
    fontFamily:'Vazir-Medium',
    fontSize:16,
    color:'#00a8a6',
  },
});

export default RequestStatus;
