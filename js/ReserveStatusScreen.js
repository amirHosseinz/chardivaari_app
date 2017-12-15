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
  Modal,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CacheStore from 'react-native-cache-store';
import Communications from 'react-native-communications';
import Moment from 'moment';
import moment from 'moment-jalaali';

import PaymentModule from './common/payment/PaymentModule';
import { productionURL } from './data';
import DeliverTerms from './DeliverTerms';


class ReserveStatusScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      reserve: {},
      token: null,
      username: null,
      role: null,
      callCenter: null,
      deliverTermsModalVisible: false,
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
    CacheStore.get('call_center').then((value) => {
      if (value != null) {
        this.setState({
          callCenter: value,
        });
      }
    });
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
    this.props.navigation.navigate(
      'conversationScreen',
      {
        party: this.state.reserve.guest_person,
        username: this.state.username,
        room: this.state.reserve.room,
      }
    );
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

    openDeliverTerms = () => {
      this.setState({
        deliverTermsModalVisible: true,
      });
    }
    closeDeliverTerms = () => {
      this.setState({
        deliverTermsModalVisible: false,
      });
    }

  _onBackButtonPress () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
    this.props.navigation.state.params.refresh();
  }

  _onCallHostPress () {
    Communications.phonecall(this.state.reserve.guest_person.cell_phone, true);
  }

  _onCallUsPress = () => {
    Communications.phonecall(this.state.callCenter, true);
  }

  _onHostRefundPress =  () => {
    this.asyncRefundPayment();
  }

  async asyncRefundPayment () {
    try {
      var {
        isPaymentSuccess,
        refID,
      } = await PaymentModule.reactReserveRefund(
        'بازپرداخت رزرو' + this.state.reserve.room.title,
        Number(this.state.reserve.room.price),
        this.state.token,
        this.state.reserve.id
      );
      if (isPaymentSuccess) {
        Alert.alert('کد پیگیری: ' + refID);
      }
    } catch (e) {
      console.log(e);
    }
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
    if (start > endDate) {
      return 0;
    }
    return(Math.ceil(Math.abs(endDate - start)/oneDay));
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

  renderCancelationDate () {
    if (this.state.reserve.is_canceled == true) {
      return(
        <View>
          <View style={styles.cost}>
          <Text style={styles.costtext}>تاریخ لغو: </Text>
            <Text style={styles.resulttextbold}>
              {this.renderJalaliDate(this.state.reserve.canceled_date)}
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderCancelByGuestDescription () {
    if (this.renderDuration(this.state.reserve.canceled_date, this.state.reserve.start_date) <= 2) {
      return(
        <Text style={styles.resulttextbold}>
          این سفر توسط مهمان لغو گردید.
        </Text>
      );
    } else {
      return(
        <View>
          <Text style={styles.resulttextbold}>
            متاسفانه مهمان این سفر را لغو کرد،
            با توجه به مقررات لغو رزرو
            لطفا هزینه‌ی
            شب اول را
             توسط لینک زیر
            بازپرداخت نمایید.
          </Text>
          <TouchableOpacity onPress={this._onHostRefundPress}>
            <Text style={styles.resulttextbold1}>
            بازپرداخت
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderDescription () {
    switch(this.state.reserve.status) {
    case 'IN_PROGRESS':
      return(
        <View>
          <Text style={styles.resulttextbold}>
            این سفر در حال انجام است،
            در صورت بروز هرگونه مشکل با
              پشتیبانی
            تماس
            بگیرید.
          </Text>
          <TouchableOpacity onPress={this._onCallUsPress}>
            <Text style={styles.resulttextbold1}>
            تماس با پشتیبانی
            </Text>
          </TouchableOpacity>
        </View>
      );
      break;
    case 'DONE':
      return(
        <Text style={styles.resulttextbold}>
          این سفر انجام شده است،
          از میزبانی شما تشکر می‌کنیم.
        </Text>
      );
      break;
    case 'ISSUED':
      return(
        <View>
          <Text style={styles.resulttextbold}>
            این رزرو نهایی شده است
            و در تاریخ رزرو
            پذیرای مهمان گرامی باشید.
            برای بهترین میزبانی
              قوانین تحویل خانه
            را مشاهده کنید.
          </Text>
          <TouchableOpacity>
            <Text style={styles.resulttextbold1} onPress={() => {this.openDeliverTerms();}}>
              قوانین تحویل خانه
            </Text>
          </TouchableOpacity>
        </View>
      );
      break;
      case 'RESOLUTION':
        return(
          <View>
            <Text style={styles.resulttextbold}>
              در حال پیگیری موضوع
              مسئله مطرح شده از سمت
              شما هستیم،
              به محض حل مسئله پیش آمده
              شما را در جریان
              قرار خواهیم داد.
              در صورت داشتن هرگونه سوال
              پشتیبانی ما در خدمت شما
              خواهد بود.
              </Text>
            <TouchableOpacity onPress={this._onCallUsPress}>
              <Text style={styles.resulttextbold1}>
                تماس با پشتیبانی
              </Text>
            </TouchableOpacity>
          </View>
        );
        break;
    case 'CANCELED_BY_HOST':
      return(
        <View>
        <Text style={styles.resulttextbold}>
          این سفر توسط شما لغو گردید،
          از طریق
              درگاه پرداخت
          می‌توانید هزینه‌ی شب اول
          را بازگردانید.
        </Text>
        <TouchableOpacity onPress={this._onHostRefundPress}>
          <Text style={styles.resulttextbold1}>
          ورود به درگاه پرداخت
          </Text>
        </TouchableOpacity>
        </View>
      );
      break;
    case 'CANCELED_BY_GUEST':
      return this.renderCancelByGuestDescription();
      break;
    default:
    }
  }

  renderPrice (input) {
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + ',' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + ',' + res;
    return(res);
  }

  renderNationalId () {
    if (this.state.reserve.status === 'ISSUED' ||
      this.state.reserve.status === 'IN_PROGRESS') {
        return(
          <View>
            <View style={styles.cost}>
              <Text style={styles.costtext}>شماره ملی مهمان: </Text>
              <Text style={styles.resulttextbold}>
                {this.state.reserve.guest_person.national_id}
              </Text>
            </View>
            <View style={styles.divider}>
            </View>
          </View>
        );
    }
    return null;
  }

  renderCallToGuest () {
    var allowedStates = ['IN_PROGRESS', 'ISSUED'];
    if (allowedStates.indexOf(this.state.reserve.status) >= 0) {
      return(
        <View>
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
        </View>
      );
    }
    return null;
  }

  renderMessageToGuest () {
    var allowedStates = ['IN_PROGRESS', 'ISSUED'];
    if (allowedStates.indexOf(this.state.reserve.status) >= 0) {
      return(
        <View style={styles.cost3}>
          <Text style={styles.costtext}>پیرامون سفر خود از میهمان سوالی دارید؟</Text>
          <TouchableOpacity onPress={this.onMessageToUserButtonPress.bind(this)}>
            <Text style={styles.pmtohost}>ارسال پیام به میهمان</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
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
            <Text style={styles.h01}>وضعیت رزرو</Text>
            <View style={{width:28}}></View>
          </View>
        </View>
    <View style={styles.main0}>
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.mainchild}>
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

              {this.renderCallToGuest()}

              {this.renderNationalId()}

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
                  {this.renderDuration(this.state.reserve.start_date, this.state.reserve.end_date)}
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
                  {this.renderPrice(String(this.state.reserve.total_price))}
                </Text>
                <Text style={styles.resulttextbold}> تومان</Text>
              </View>
              <View style={styles.divider}>
              </View>

              {this.renderCancelationDate()}

              <View style={styles.cost}>
                <Text style={styles.costtext}>توضیحات: </Text>
              </View>
              <View style={styles.cost1}>
                {this.renderDescription()}
              </View>
              <View style={styles.divider}>
              </View>

              {this.renderMessageToGuest()}
              <View style={{ marginBottom:25,}}></View>
              {this.renderAccRejButton()}
          </View>
        </View>
      </ScrollView>
      <Modal
      animationType='slide'
      transparent={false}
      visible={this.state.deliverTermsModalVisible}
      onRequestClose={() => {
        this.closeDeliverTerms();
      }}>
      <DeliverTerms onCloseModal={this.closeDeliverTerms}>
      </DeliverTerms>
      </Modal>
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
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#3e3e3e',
    marginTop:16,
  },
  h01:{
    fontSize:20,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#ffffff',
  },
  h2:{
    fontSize:18,
    fontFamily:'IRANSansMobileFaNum-Thin',
    color:'#3e3e3e',
    marginBottom:30,
  },
  cost:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
    marginRight:36,
  },
  costtext:{
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:14,
    color:'#3e3e3e',
  },
  resulttextbold:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#3e3e3e',
  },
  resulttextbold1:{
    fontFamily:'IRANSansMobileFaNum-Medium',
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
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
    color:'#00a8a6',
    marginBottom:25,
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
    fontFamily:"IRANSansMobileFaNum-Medium",
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
    width: Dimensions.get('window').width,
    alignItems:'center',
  },
  mainchild:{
    width: Dimensions.get('window').width-36,
  },
  main0:{
    height: Dimensions.get('window').height-(StatusBar.currentHeight+56),
    backgroundColor:'#ffffff',
  },

});

export default ReserveStatusScreen;
