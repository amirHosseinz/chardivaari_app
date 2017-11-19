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
  StatusBar,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CacheStore from 'react-native-cache-store';
import Communications from 'react-native-communications';
import Moment from 'moment';
import moment from 'moment-jalaali';

import { testURL, productionURL } from './data';


class TripStatusScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      trip: {},
      token: null,
      username: null,
      role: null,
    };
  }

  componentWillMount () {
    this.setState({
      trip: this.props.navigation.state.params.trip,
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
      this.checkTrip();
    });
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  checkTrip () {
    fetch(productionURL + '/api/reservation/check/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: 'guest',
        reserve_id: this.state.trip.id,
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
        recipient: this.state.trip.room.owner.username,
        subject: 'رزرو خانه‌ی ' + this.state.trip.room.title,
        room_id: this.state.trip.room.id,
        body: 'صحبت درباره‌ی رزرو خانه‌ی ' + this.state.trip.room.title,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا از اتصال به اینترنت مطمئن شوید.');
    });
  }

  onResponseRecieved (response) {
    body = JSON.parse(response._bodyText);
    if (response.status === 200) {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.trip.room.owner,
          messageId: body.message_id,
          username: this.state.username,
          room: this.state.trip.room,
        }
      );
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onCancelTripPress () {
    Alert.alert(
      'درخواست لغو سفر',
      'سفر شما لغو شود؟',
      [
        {text: 'بله', onPress: () => {
          this.cancelTrip();
        },},
        {text: 'خیر', onPress: () => {},},
      ],
      { cancelable: false }
    );
  }

  cancelTrip () {
    fetch(productionURL + '/api/reservation/cancel/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.state.role,
        reserve_id: this.state.trip.id,
      }),
    })
    .then((response) => this.onCancelTripResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.log(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نماییدد.');
    });
  }

  onCancelTripResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.successful != false) {
        if (body.reserve.is_canceled == true) {
          this._onBackButtonPress();
        }
      } else {
        Alert.alert('شما نمی‌توانید سفر را لغو نمایید.');
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
    Communications.phonecall(this.state.trip.room.owner.cell_phone, true);
  }

  renderStatus () {
    switch(this.state.trip.status) {
    case 'IN_PROGRESS':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
          <Text style={styles.h2}>در حال انجام</Text>
        </View>
      );
      break;
    case 'DONE':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
          <Text style={styles.h2}>انجام شده</Text>
        </View>
      );
      break;
    case 'RESOLUTION':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
          <Text style={styles.h2}>در حال بررسی مشکل</Text>
        </View>
      );
      break;
    case 'ISSUED':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
          <Text style={styles.h2}>صادر شده</Text>
        </View>
      );
      break;
    case 'CANCELED_BY_HOST':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
          <Text style={styles.h2}>لغو شده توسط میزبان</Text>
        </View>
      );
      break;
    case 'CANCELED_BY_GUEST':
      return(
        <View style={styles.header}>
          <Text style={styles.h2}>وضعیت: </Text>
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
    if (this.state.trip.status === 'ISSUED') {
      return(
        <View style={styles.downside}>
          <View style={styles.buttonstyle}>
            <TouchableOpacity style={styles.buttontouch} onPress={this.onCancelTripPress.bind(this)}>
              <View style={styles.buttonview}>
              <Text style={styles.reservebuttontext}>لغو سفر</Text>
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
          <View style={styles.header0}>
            <View style={styles.header00}>
              <TouchableOpacity onPress={this._onBackButtonPress.bind(this)}>
                  <Icon size={28} color="#ffffff" name="arrow-forward" />
              </TouchableOpacity>
              <Text style={styles.h1}>وضعیت سفر</Text>
              <View style={{width:28}}></View>
            </View>
          </View>

          <View style={styles.main}>
            <View style={styles.mainchild}>
            <ScrollView>

              {this.renderStatus()}
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}>نام اقامتگاه: </Text>
                <Text style={styles.resulttextbold}>{this.state.trip.room.title}</Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost1}>
                <Text style={styles.costtext}>آدرس: </Text>
                <Text style={styles.resulttextbold}>{this.state.trip.room.postal_address}</Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}> میزبان: </Text>
                <Text style={styles.resulttextbold}>
                  {this.state.trip.room.owner.first_name} {this.state.trip.room.owner.last_name}
                </Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}> شماره تماس: </Text>
                <Text style={styles.resulttextbold}>
                  {this.state.trip.room.owner.cell_phone}
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
                  {this.renderJalaliDate(this.state.trip.start_date)}
                </Text>
              </View>
              <View style={styles.cost}>
              <Text style={styles.costtext}>تاریخ خروج: </Text>
                <Text style={styles.resulttextbold}>
                  {this.renderJalaliDate(this.state.trip.end_date)}
                </Text>
              </View>
              <View style={styles.cost}>
              <Text style={styles.costtext}>مدت اقامت: </Text>
                <Text style={styles.resulttextbold}>
                  {this.renderDuration(this.state.trip.end_date, this.state.trip.start_date)}
                </Text>
                <Text style={styles.resulttextbold}> روز</Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}>تعداد مسافران: </Text>
                <Text style={styles.resulttextbold}>
                  {this.state.trip.number_of_guests}
                </Text>
                <Text style={styles.resulttextbold}> نفر </Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}>هزینه پرداخت شده:  </Text>
                <Text style={styles.resulttextbold}>
                  {this.state.trip.total_price}
                </Text>
                <Text style={styles.resulttextbold}> تومان</Text>
              </View>
              <View style={styles.divider}>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costtext}>پیرامون سفر خود از میزبان سوالی دارید؟</Text>
                <TouchableOpacity onPress={this.onMessageToUserButtonPress.bind(this)}>
                  <Text style={styles.pmtohost}>  ارسال پیام </Text>
                </TouchableOpacity>
              </View>

              {this.renderAccRejButton()}
              </ScrollView>
            </View>
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
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('screen').width ,
  },
  backbuttonview:{
    flexDirection:'row-reverse',
    marginTop:14,
  },
  header:{
    flexDirection:'row-reverse',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  h1:{
    fontSize:20,
    fontFamily:'Vazir-Medium',
    color:'#ffffff',
  },
  h2:{
    fontSize:16,
    fontFamily:'Vazir-Medium',
    color:'#3e3e3e',
    marginTop:15,
    textAlign:'center',
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
    height: 1,
    width:Dimensions.get('window').width-36 ,
    backgroundColor: '#d7d7d7',
    marginTop: 11,
    marginBottom: 11,
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
    height:46,
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
    height:38,
    width: 160,
    alignItems:"center",
    justifyContent:"center",
  },
  downside:{
    flex:1,
    flexDirection:'column-reverse',
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
  },
  buttonstyle:{
    alignItems:'center',
  },
  header0:{
    backgroundColor:'#0ca6c1',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:5,
  },
  header00:{
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:5,
  },
  main:{
    flex:1,
    backgroundColor:'#ffffff',
    alignItems:'center',
    height: Dimensions.get('window').height-(StatusBar.currentHeight+56),

  },
  mainchild:{
    width: Dimensions.get('window').width-36,
  },
});

export default TripStatusScreen;
