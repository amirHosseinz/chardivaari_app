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
  Modal,
  Linking,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import moment from 'moment-jalaali';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import PaymentModule from './common/payment/PaymentModule';
import { productionURL, GATrackerId } from './data';
import RejectTerms from './RejectTerms';


class RequestStatus extends Component {
  constructor (props) {
    super(props);
    this.state={
      request: {},
      role: null,
      token: null,
      username: null,
      tracker: null,
      rejectTermsModalVisible: false,
      vpnModalVisible: false,
    };
  }

  componentWillMount() {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    this.setState({
      request: this.props.navigation.state.params.request,
      role: this.props.navigation.state.params.role,
      tracker: tracker,
    });
    // load token and username from CacheStore
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  setToken (token) {
    this.setState({
      token
    }, () => {
      this.checkRequest();
    });
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  checkRequest () {
    fetch(productionURL + '/api/request/check/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.state.role,
        request_id: this.state.request.id,
      }),
    })
    .then((response) => this.onCheckResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت، مجددا تلاش نمایید.');
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

  archiveRequest () {
    fetch(productionURL + '/api/request/archive/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.state.role,
        request_id: this.state.request.id,
      }),
    })
    .then((response) => this.onArchiveResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت، مجددا تلاش نمایید.');
    });
  }

  onArchiveResponseRecieved (response) {
    if (response.status === 200) {
      // successful
      this.backNavigation();
      Alert.alert('درخواست شما حذف گردید.');
    } else {
      // failure
    }
  }

  backNavigation = () => {
    this.props.navigation.state.params.refresh();
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  openRejectTerms = () => {
    this.setState({
      rejectTermsModalVisible: true,
    });
  }
  closeRejectTerms = () => {
    this.setState({
      rejectTermsModalVisible: false,
    });
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
          <Text style={styles.h1}>رد شده توسط میزبان</Text>
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
          <Text style={styles.h1}>پرداخت شده توسط مهمان</Text>
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
            <View style={styles.interpersonresult}>
              <Text style={styles.costtext}>نام اقامتگاه: </Text>
              <Text style={styles.resulttextbold}>
                {this.state.request.room.title}
              </Text>
            </View>
        );
      } else if (this.state.request.eco_room &&
                this.state.request.eco_room.title != ''
      ) {
        return(
            <View style={styles.interpersonresult}>
              <Text style={styles.costtext}>نام اقامتگاه: </Text>
              <Text style={styles.resulttextbold}>
                {this.state.request.eco_room.title}
              </Text>
            </View>
        );
      }
  }

  renderJalaliDate (date) {
    return moment(date, 'YYYY-M-DTHH:mm:ssZ').format('jYYYY/jM/jD');
  }

  renderHostName () {
    if (this.state.request.room) {
      return(
        <Text style={styles.resulttextbold}>
          {this.state.request.room.owner.last_name}
        </Text>
      );
    } else if (this.state.request.eco_room) {
      return(
        <Text style={styles.resulttextbold}>
          {this.state.request.eco_room.owner.last_name}
        </Text>
      );
    }
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
    if (this.state.tracker != null) {
      this.state.tracker.trackEvent('requestBook', 'cancelRequest', {
        label: this.state.request.status,
        value: this.state.request.id,
      });
    }
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
      'رد درخواست',
      'این درخواست را رد می‌کنید؟',
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
    if (this.state.tracker != null) {
      this.state.tracker.trackEvent('requestBook', 'rejectRequest', {
        label: this.state.request.status,
        value: this.state.request.id
      });
    }
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

  onWebPaymentRequestRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.is_successful) {
        Linking.openURL(body.payment_url)
        .catch(err => console.log('An error occurred', err));
      } else {
        if (body.is_vpn_on) {
          this.openVPNModal();
        }
      }
    } else {
      // TODO
    }
  }

  async asyncPayment () {
    fetch(productionURL + '/api/payment/web_payment_request/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        request_id: this.state.request.id,
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
      }),
    })
    .then((response) => this.onWebPaymentRequestRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
      // try {
      //   var {
      //     isPaymentSuccess,
      //     refID,
      //   } = await PaymentModule.reactRequestPayment(
      //     'جهت رزرو ' + this.state.request.room.title,
      //     Number(this.state.request.total_price),
      //     this.state.token,
      //     this.state.request.id
      //   );
      //   if (isPaymentSuccess) {
      //     Alert.alert('کد پیگیری: ' + refID);
      //     // this.payRequestDone();
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
  }

  // payRequestDone = () => {
  //   fetch(productionURL + '/api/request/pay/', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Token ' + this.state.token,
  //     },
  //     body: JSON.stringify({
  //       request_id: this.state.request.id,
  //       role: this.state.role,
  //     }),
  //   })
  //   .then((response) => this.onPayRequestResponseRecieved(response))
  //   .catch((error) => {
  //     Alert.alert('لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
  //   });
  // }

  onPayRequestPress = () => {
    this.asyncPayment();
    // this.backNavigation();
  }

  // onPayRequestResponseRecieved (response) {
  //   if (response.status === 200) {
  //     this.backNavigation();
  //     Alert.alert('درخواست پرداخت گردید.');
  //   } else if (response.status === 203) {
  //     // NON_AUTHORITATIVE_INFORMATION
  //     Alert.alert('خطای اطلاعات ناقص');
  //   } else {
  //     Alert.alert('خطایی رخ داده.');
  //   }
  // }

  onContactToUserPress = () => {
    if (this.state.role === 'host') {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.request.guest_person,
          username: this.state.request.room.owner.username,
          room: this.state.request.room,
        }
      );
    } else if (this.state.role === 'guest') {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.request.room.owner,
          username: this.state.request.guest_person.username,
          room: this.state.request.room,
        }
      );
    }
  }

  renderContactToUser () {
    var forbiddenStates = ['HOST_REJECTED', 'HOST_ACCEPTED_GUEST_CANCELED',
      'HOST_ACCEPTED_GUEST_PAYED', 'HOST_ACCEPTED_HOST_CANCELED', ];
    if (forbiddenStates.indexOf(this.state.request.status) >= 0) {
      return null;
    }
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
            <Text style={styles.pmtohost}> پیام به میزبان</Text>
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
                  <Text style={styles.reservebuttontext}>رد درخواست</Text>
                </View>
                </TouchableOpacity>
            </View>
          );
        } else if (this.state.role === 'guest') {
          return(
            <View style={styles.bottombarbutton}>
                <TouchableOpacity style={styles.buttontouch1} onPress={this.onCancelRequestButtonPress}>
                  <View style={styles.buttonview1}>
                  <Text style={styles.reservebuttontext}>لغو درخواست</Text>
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

  renderButtonSection () {
    withButtonStatuses = ['WAIT_FOR_GUEST_PAY', 'WAIT_FOR_HOST'];
    if (withButtonStatuses.indexOf(this.state.request.status) > -1) {
      return(
        <View style={styles.bottombar}>
           <View style={styles.bottombarchild}>
             {this.renderRejectCancelButton()}
             {this.renderAcceptPayButton()}
           </View>
        </View>
      );
    } else {
      return(
        <View style={styles.bottombar}>
           <View style={styles.bottombarchild}>
             <View style={styles.bottombarbutton}>
                 <TouchableOpacity style={styles.buttontouch2} onPress={() => {
                   this.archiveRequest();
                 }}>
                   <View style={styles.buttonview2}>
                   <Text style={styles.reservebuttontext}>
                    حذف کردن
                   </Text>
                 </View>
                 </TouchableOpacity>
             </View>
           </View>
        </View>
      );
    }
  }

  renderDescription () {
    switch (this.state.request.status) {
      case 'WAIT_FOR_HOST':
        if (this.state.role === 'host') {
          return(
            <View>
              <Text style={styles.resulttext}>
                بعد از تایید این درخواست توسط شما،
                در صورت پرداخت هزینه توسط مهمان رزرو نهایی شده
                و به اطلاع شما می‌رسد.
                در صورت لغو توسط شما یا مهمان بعد از پرداخت
                قوانین لغو
                اعمال می‌شود.
              </Text>
              <View style={styles.interpersonresult}>
                <TouchableOpacity onPress={() => {this.openRejectTerms();}}>
                  <Text style={styles.resulttext2}>
                  مشاهده قوانین لغو
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        } else if (this.state.role === 'guest') {
          return(
            <Text style={styles.resulttext}>
              درخواست شما در انتظار تایید میزبان است
              و پس از تایید میزبان،
              می‌توانید هزینه را پرداخت کنید و رزرو خود را
              نهایی کنید.
            </Text>
          );
        }
        break;
      case 'GUEST_CANCELED':
        break;
      case 'HOST_REJECTED':
        if (this.state.role === 'host') {
          return(
            <Text style={styles.resulttext}>
              این درخواست توسط شما مورد قبول واقع
              نشده است.
            </Text>
          );
        } else if (this.state.role === 'guest') {
          return(
            <Text style={styles.resulttext}>
              متاسفانه درخواست شما توسط میزبان مورد تایید
              قرار نگرفت.
            </Text>
          );
        }
        break;
      case 'WAIT_FOR_GUEST_PAY':
        if (this.state.role === 'host') {
          return(
            <Text style={styles.resulttext}>
              این درخواست توسط شما تایید شده است
              و در انتظار پرداخت هزینه توسط مهمان است.
            </Text>
          );
        } else if (this.state.role === 'guest') {
          return(
            <View>
              <Text style={styles.resulttext}>
                درخواست شما تایید شده است،
                با پرداخت هزینه رزرو خود را نهایی کنید.
                در صورت لغو توسط شما و یا میزبان
                بعد از پرداخت هزینه،
                قوانین لغو
                اعمال می‌شود.
              </Text>
              <View style={styles.interpersonresult}>
                <TouchableOpacity onPress={() => {this.openRejectTerms();}}>
                  <Text style={styles.resulttext2}>
                  مشاهده قوانین لغو
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
        break;
      case 'HOST_ACCEPTED_GUEST_CANCELED':
        if (this.state.role === 'host') {
          return(
            <Text style={styles.resulttext}>
              این درخواست توسط مهمان قبل از
              پرداخت هزینه لغو شد.
            </Text>
          );
        } else if (this.state.role === 'guest') {
          return(
            <Text style={styles.resulttext}>
              این درخواست توسط شما لغو گردید.
            </Text>
          );
        }
        break;
      case 'HOST_ACCEPTED_HOST_CANCELED':
        if (this.state.role === 'host') {
          return(
            <Text style={styles.resulttext}>
              این درخواست توسط شما
              قبل از پرداخت هزینه لغو شد.
            </Text>
          );
        } else if (this.state.role === 'guest') {
          return(
            <Text style={styles.resulttext}>
              متاسفانه درخواست شما
              توسط میزبان
              مورد تایید قرار نگرفت.
            </Text>
          );
        }
        break;
      case 'HOST_ACCEPTED_GUEST_PAYED':
        if (this.state.role === 'host') {
          return(
            <Text style={styles.resulttext}>
              این رزرو نهایی شده است، برای مشاهده‌ی جزئیات آن
              به بخش
              رزروها
              مراجعه کنید.
            </Text>
          );
        } else if (this.state.role === 'guest') {
          return(
            <Text style={styles.resulttext}>
              این رزرو نهایی شده است،
              برای مشاهده‌ی جزئیات آن به بخش
              سفرها
              مراجعه کنید.
            </Text>
          );
        }
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

  openVPNModal = () => {
    this.setState({
      vpnModalVisible: true,
    });
  }

  closeVPNModal = () => {
    this.setState({
      vpnModalVisible: false,
    });
  }

  render () {
    return(
      <View style={styles.container0}>
        <View style={styles.container1}>
        <View style={styles.header0}>
          <View style={styles.header00}>
            <TouchableOpacity onPress={this.backNavigation}>
                <Icon size={28} color="#ffffff" name="arrow-forward" />
            </TouchableOpacity>
            <Text style={styles.h01}>وضعیت درخواست</Text>
            <View style={{width:28}}></View>
          </View>
        </View>
        <ScrollView>
          <View style={styles.main0}>
            <View style={styles.main1}>
              {this.renderStatus()}
              <View style={styles.costbox}>
                {this.renderTitle()}
                <View style={styles.divider}>
                </View>
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
                {this.renderHostName()}
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
                  {this.renderPrice(String(this.state.request.total_price))}
                </Text>
                <Text style={styles.costtextfinal}> تومان</Text>
              </View>
              <View style={styles.divider}>
              </View>

              <View style={styles.interpersonresult}>
              <Text style={styles.resulttextbold}>توضیحات: </Text>
              </View>
              <View style={styles.interpersonresult}>

              {this.renderDescription()}
              </View>
              <View style={styles.divider}>
              </View>

              {this.renderContactToUser()}
                <View  style={{marginBottom:25}}>
                </View>
              </View>
            </View>
          </ScrollView>

          <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.rejectTermsModalVisible}
          onRequestClose={() => {
            this.closeRejectTerms();
          }}>
          <RejectTerms onCloseModal={this.closeRejectTerms}>
          </RejectTerms>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.vpnModalVisible}
            onRequestClose={() => {
              this.closeVPNModal();
            }}>
           <View style={styles.popup}>
           <TouchableOpacity onPress={this.closeVPNModal}>
             <View style={styles.backbuttonview}>
               <Icon size={40} color="#f3f3f3" name="close" />
             </View>
           </TouchableOpacity>
            <View style={styles.popuptextbox}>
              <Text style={styles.popuptext}>
                در صورتی که خارج از کشور هستید با پشتیبانی تماس بگیرید، در غیر این صورت از خاموش بودن vpn خود اطمینان حاصل نمایید.
              </Text>
                <TouchableOpacity style={styles.buttontouch3} onPress={() => {
                  this.closeVPNModal();
                }}>
                <View>
                <Text style={styles.reservebuttontext}>
                  تایید
                </Text>
              </View>
              </TouchableOpacity>
            </View>
           </View>
          </Modal>

      </View>

      {this.renderButtonSection()}
   </View>
     );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'white',

  },
  container1: {
    flex: 1,
    flexDirection:'column',
  },
  header:{
    justifyContent:'center',
    alignItems:'center',
  },
  h1:{
    fontSize:20,
    fontFamily:'IRANSansMobileFaNum-Medium',
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
    fontFamily: 'IRANSansMobileFaNum-Medium',
    fontSize:18,
    marginRight:5,
  },
  interpersonresult:{
    alignItems: 'flex-start',
    flexDirection:'row-reverse',
  },
  resulttext:{
    textAlign: 'right',
    alignSelf: 'stretch',
    fontFamily: 'IRANSansMobileFaNum-Light',
    fontSize:14,
    color:'#000000',
  },
  divider:{
    height: 1,
    width:Dimensions.get('window').width-36 ,
    backgroundColor: '#d7d7d7',
    marginTop: 11,
    marginBottom: 11,
  },
  costbox:{
    alignItems:'flex-end',
    width:Dimensions.get('window').width-36,
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
    fontFamily:'IRANSansMobileFaNum-Light',
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
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#f56e4e',
  },
  disdetatiltext:{
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:12,
    color:'#f56e4e',
  },
  bottombar: {
    width: Dimensions.get('screen').width,
    height:56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent:"center",
    elevation:5,
  },
  bottombarchild: {
    width: Dimensions.get('screen').width-30,
    flex:1,
    flexDirection: "row-reverse",
    justifyContent:'space-between',
    elevation:5,
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
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#3e3e3e",
    justifyContent: "center",
    alignItems: "center",
  },
  pernighttext: {
    fontSize: 20,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#787878",
    justifyContent:"flex-end",
  },
  reservebuttontext: {
    fontSize: 16,
    fontFamily:"IRANSansMobileFaNum-Medium",
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
    height:46,
    width: (Dimensions.get('screen').width-70)/2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttontouch1: {
    borderColor:"#bebebe",
    borderRadius: 50,
    borderWidth : 2,
    height:46,
    width: (Dimensions.get('screen').width-70)/2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttontouch2: {
    borderColor:"#f56e4e",
    borderRadius: 50,
    borderWidth : 2,
    height:46,
    width: (Dimensions.get('screen').width-70)/2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttontouch3: {
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 148,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttonview: {
    backgroundColor:"#00cecc",
    borderRadius: 50,
    height:38,
    width: (Dimensions.get('screen').width-86)/2,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  buttonview1: {
    backgroundColor:"#bebebe",
    borderRadius: 50,
    height:38,
    width: (Dimensions.get('screen').width-86)/2,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  buttonview2: {
    backgroundColor:"#f57253",
    borderRadius: 50,
    height:38,
    width: (Dimensions.get('screen').width-86)/2,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  checkcodetext:{
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:14,
    color:'#00a8a6',
  },
  inputstyle:{
    width:60,
  },
  backbuttonview: {
    alignItems:'flex-end',
    marginRight:25,
    marginTop:25,
  },
  resulttextbold:{
    textAlign: 'right',
    alignSelf: 'stretch',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#3e3e3e',
  },
  costtextfinal:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#f56e4e',
  },
  pmtohost:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
    color:'#00a8a6',
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
  h01:{
    fontSize:20,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#ffffff',
  },
  main0:{
    flex:1,
    alignItems:'center',
  },
  main1:{
    width: Dimensions.get('window').width-36,
  },
  resulttext2:{
    fontFamily:"IRANSansMobileFaNum-Medium",
    fontSize:14,
    color:"#f56e4e"
  },
  popup:{
    backgroundColor:  'rgba(0,0,0,0.82)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  popuptext:{
    color:'white',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:20,
    textAlign:'center',
    width: Dimensions.get('window').width - 50,
    marginTop:180,
    marginBottom:30,
  },
  popuptextbox:{
    alignItems:'center'
  },
});

export default RequestStatus;
