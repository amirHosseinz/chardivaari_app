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
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CacheStore from 'react-native-cache-store';
import Communications from 'react-native-communications';
import Moment from 'moment';
import moment from 'moment-jalaali';

import { testURL, productionURL } from './data';


class ReserveStatusScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      reserve: {},
      token: null,
      username: null,
      role: null,
    };
  }

  componentWillMount () {
    this.setState({
      reserve: this.props.navigation.state.params.reserve,
      role: this.props.navigation.state.params.role,
    });
    // load token and username from CacheStore
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  setToken (token) {
    this.setState({
      token
    }, () => {
      this.checkReserve();
    });
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  checkReserve () {
    fetch(productionURL + '/api/reservation/check/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: 'host',
        reserve_id: this.state.reserve.id,
      }),
    })
    .then((response) => this.onCheckResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نمایید.');
    });
  }

  onCheckResponseRecieved (response) {
    if (response.status === 200) {
      // successful
      this.props.navigation.state.params.refresh();
    } else {
      // failure
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
        recipient: this.state.reserve.guest_person.username,
        subject: 'رزرو خانه‌ی ' + this.state.reserve.room.title,
        room_id: this.state.reserve.room.id,
        body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.reserve.room.title,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.reserve.guest_person,
          messageId: body.message_id,
          username: this.state.username,
          room: this.state.reserve.room,
        }
      );
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onCancelReservePress () {
    Alert.alert(
      'درخواست لغو رزرو',
      'رزرو شما لغو شود؟',
      [
        {text: 'بله', onPress: () => {
          this.cancelReserve();
        },},
        {text: 'خیر', onPress: () => {},},
      ],
      { cancelable: false }
    );
  }

  cancelReserve () {
    fetch(productionURL + '/api/reservation/cancel/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.state.role,
        reserve_id: this.state.reserve.id,
      }),
    })
    .then((response) => this.onCancelReserveResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نماییدد.');
    });
  }

  onCancelReserveResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.successful != false) {
        if (body.reserve.is_canceled == true) {
          this._onBackButtonPress();
        }
      } else {
        Alert.alert('شما نمی‌توانید رزرو را لغو کنید.');
      }
    } else {
      // TODO
      // error handle
    }
  }

  _onBackButtonPress () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
    this.props.navigation.state.params.refresh();
  }

  _onCallHostPress () {
    Communications.phonecall(this.state.reserve.guest_person.cell_phone, true);
  }

  renderStatus () {
    switch(this.state.reserve.status) {
    case 'IN_PROGRESS':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>وضعیت رزرو</Text>
          <Text style={styles.h2}>در حال انجام</Text>
        </View>
      );
      break;
    case 'DONE':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>وضعیت رزرو</Text>
          <Text style={styles.h2}>انجام شده</Text>
        </View>
      );
      break;
    case 'ISSUED':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>وضعیت رزرو</Text>
          <Text style={styles.h2}>صادر شده</Text>
        </View>
      );
      break;
      case 'RESOLUTION':
        return(
          <View style={styles.header}>
            <Text style={styles.h1}>وضعیت رزرو</Text>
            <Text style={styles.h2}>در حال بررسی مشکل</Text>
          </View>
        );
        break;
    case 'CANCELED_BY_HOST':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>وضعیت رزرو</Text>
          <Text style={styles.h2}>لغو شده توسط میزبان</Text>
        </View>
      );
      break;
    case 'CANCELED_BY_GUEST':
      return(
        <View style={styles.header}>
          <Text style={styles.h1}>وضعیت رزرو</Text>
          <Text style={styles.h2}>لغو شده توسط مهمان</Text>
        </View>
      );
      break;
    default:
    }
  }

  renderJalaliDate (date) {
    return moment(date, 'YYYY-M-DTHH:mm:ssZ').format('jYYYY/jM/jD');
  }

  renderDuration (startDate, endDate) {
    var oneDay = 24*60*60*1000;
    startDate = Moment(startDate, 'YYYY-M-DTHH:mm:ssZ').clone();
    start = startDate.toDate();
    endDate = Moment(endDate, 'YYYY-M-DTHH:mm:ssZ').clone().toDate();
    return(Math.round(Math.abs(endDate - start)/oneDay));
  }

  renderAccRejButton () {
    if (this.state.reserve.status === 'ISSUED') {
      return(
        <View style={styles.downside}>
          <View style={styles.buttonstyle}>
            <TouchableOpacity style={styles.buttontouch} onPress={this.onCancelReservePress.bind(this)}>
              <View style={styles.buttonview}>
              <Text style={styles.reservebuttontext}>لغو رزرو</Text>
            </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render () {
    return(
      <View style={styles.container0}>
        <View style={styles.container1}>
          <TouchableOpacity onPress={this._onBackButtonPress.bind(this)}>
            <View style={styles.backbuttonview}>
              <Icon size={44} color="#3e3e3e" name="keyboard-arrow-right" />
            </View>
          </TouchableOpacity>
      <ScrollView
      showsHorizontalScrollIndicator={false}>
          {this.renderStatus()}
          <View style={styles.cost}>
            <Text style={styles.costtext}>نام اقامتگاه: </Text>
            <Text style={styles.resulttextbold}>{this.state.reserve.room.title}</Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost1}>
            <Text style={styles.costtext}>آدرس: </Text>
            <Text style={styles.resulttextbold}>{this.state.reserve.room.address}</Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost}>
            <Text style={styles.costtext}> میهمان: </Text>
            <Text style={styles.resulttextbold}>
              {this.state.reserve.guest_person.first_name} {this.state.reserve.guest_person.last_name}
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost}>
            <Text style={styles.costtext}> شماره تماس: </Text>
            <Text style={styles.resulttextbold}>
              {this.state.reserve.guest_person.cell_phone}
            </Text>
            <TouchableOpacity onPress={this._onCallHostPress.bind(this)}>
            <Text style={styles.resulttextbold1}>  تماس</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost}>
          <Text style={styles.costtext}>تاریخ ورود: </Text>
            <Text style={styles.resulttextbold}>
              {this.renderJalaliDate(this.state.reserve.start_date)}
            </Text>
          </View>
          <View style={styles.cost}>
          <Text style={styles.costtext}>تاریخ خروج: </Text>
            <Text style={styles.resulttextbold}>
              {this.renderJalaliDate(this.state.reserve.end_date)}
            </Text>
          </View>
          <View style={styles.cost}>
          <Text style={styles.costtext}>مدت اقامت: </Text>
            <Text style={styles.resulttextbold}>
              {this.renderDuration(this.state.reserve.end_date, this.state.reserve.start_date)}
            </Text>
            <Text style={styles.resulttextbold}> روز</Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost}>
            <Text style={styles.costtext}>تعداد مسافران: </Text>
            <Text style={styles.resulttextbold}>
              {this.state.reserve.number_of_guests}
            </Text>
            <Text style={styles.resulttextbold}> نفر </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.cost}>
            <Text style={styles.costtext}>هزینه پرداخت شده:  </Text>
            <Text style={styles.resulttextbold}>
              {this.state.reserve.total_price}
            </Text>
            <Text style={styles.resulttextbold}> تومان</Text>
          </View>
          <View style={styles.divider}>
          </View>
          <Text style={styles.costtext}>پیرامون سفر خود از میهمان سوالی دارید؟</Text>
          <TouchableOpacity onPress={this.onMessageToUserButtonPress.bind(this)}>
            <Text style={styles.pmtohost}>ارسال پیام به میهمان</Text>
          </TouchableOpacity>

      </ScrollView>

        {this.renderAccRejButton()}
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
  backbuttonview:{
    flexDirection:'row-reverse',
    marginTop:14,
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
  },
  h2:{
    fontSize:18,
    fontFamily:'Vazir-Thin',
    color:'#3e3e3e',
    marginBottom:30,
  },
  cost:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
  },
  costtext:{
    fontFamily:'Vazir-Light',
    fontSize:14,
    color:'#3e3e3e',
  },
  resulttextbold:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#3e3e3e',
  },
  resulttextbold1:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#00a8a6',
  },
  divider:{
    height: 2,
    width:Dimensions.get('window').width-50 ,
    backgroundColor: '#d7d7d7',
    marginTop: 12,
    marginBottom: 12,
  },
  pmtohost:{
    fontFamily:'Vazir-Medium',
    fontSize:16,
    color:'#00a8a6',
  },
  buttontouch: {
    borderColor:"#f56e4e",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 168,
    justifyContent:"center",
    alignItems:"center",
  },
  reservebuttontext: {
    fontSize: 17,
    fontFamily:"Vazir-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttonview: {
    backgroundColor:"#f56e4e",
    borderRadius: 50,
    height:40,
    width: 160,
    alignItems:"center",
    justifyContent:"center",
  },
  downside:{
    flex:1,
    flexDirection:'column-reverse',
    alignItems:'center',
    marginBottom:70,
    marginTop:20,
  },
  buttonstyle:{
    alignItems:'center',
  }
});

export default ReserveStatusScreen;
