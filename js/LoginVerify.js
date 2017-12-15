import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import SmsListener from 'react-native-android-sms-listener';
import timer from 'react-native-timer';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { GATrackerId, productionURL } from './data';


class LoginVerify extends Component {
  constructor (props) {
    super(props);
    this.state={
      cellPhoneNo: '',
      counter: 0,
      verificationCode: null,
      smsCenter: null,
      subscription: null,
      tracker: null,
    };
  }

  componentWillMount () {
    this.counterTrigger();
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('LoginVerify');
    this.setState({
      cellPhoneNo: this.props.navigation.state.params.cellPhoneNo,
      smsCenter: this.props.navigation.state.params.smsCenter,
      tracker: tracker,
    });
    let sbs = SmsListener.addListener(message => {
      if (message.originatingAddress.indexOf(this.state.smsCenter) > -1 ) {
        this.setState({
          verificationCode: message.body,
        }, () => {
          this.checkVerificationCode();
        });
        sbs.remove();
      }
    });
    this.setState({
      subscription: sbs,
    });
  }

  componentWillUnMount () {
    this.state.subscription.remove();
    timer.clearInterval(this);
  }

  resetNavigation (targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  checkVerificationCode () {
    fetch(productionURL + '/auth/api/user/verification/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cell_phone: this.state.cellPhoneNo,
        verification_code: this.state.verificationCode,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      timer.clearInterval(this);
      if (body.token != null) {
        CacheStore.set('token', body.token);
        CacheStore.set('username', body.user.username);
        CacheStore.set('user', body.user);
        this.state.tracker.setUser(body.user.username);
        this.resetNavigation('guestScreen');
      } else {
        this.props.navigation.navigate('loginGetName', {
          firstName: body.user.first_name,
          lastName: body.user.last_name,
          cellPhoneNo: this.state.cellPhoneNo,
          verificationCode: this.state.verificationCode,
        });
      }
    } else if (response.status === 401) {
      Alert.alert('کد وارد شده معتبر نمی‌باشد.');
    } else {
      // TODO
      // error handle
    }
  }

  onTextChanged = (verificationCode) => {
    this.setState({
      verificationCode
    }, () => {
      if (this.state.verificationCode.length == 4) {
        this.checkVerificationCode();
      }
    });
  }

  onWrongNumberButtonPress () {
    if (this.state.subscription) {
      this.state.subscription.remove();
    }
    timer.clearInterval(this);
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  onResendButtonPress () {
    this.state.subscription.remove();
    this.counterTrigger();
    fetch(productionURL + '/auth/api/signup/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cell_phone: this.state.cellPhoneNo,
      }),
    })
    .then((response) => this.onResendResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.log(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onResendResponseRecieved (response) {
    if (response.status === 201) {
      body = JSON.parse(response._bodyText);
      this.setState({
        smsCenter: body.sms_center,
      }, () => {
        let sbs = SmsListener.addListener(message => {
          if (message.originatingAddress == this.state.smsCenter) {
            this.setState({
              verificationCode: message.body,
            }, () => {
              this.checkVerificationCode();
            });
            sbs.remove();
          }
        });
        this.setState({
          subscription: sbs,
        });
      });
    } else if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        smsCenter: body.sms_center,
      }, () => {
        let sbs = SmsListener.addListener(message => {
          if (message.originatingAddress == this.state.smsCenter) {
            this.setState({
              verificationCode: message.body,
            }, () => {
              this.checkVerificationCode();
            });
            sbs.remove();
          }
        });
        this.setState({
          subscription: sbs,
        });
      });
    } else if (response.status === 400) {
      body = JSON.parse(response._bodyText);
      if ('confirm_password' in body) {
        // this.onLoginFail('دو رمز عبور وارد شده یکسان نیست.');
      } else if ('username' in body) {
        // this.onLoginFail('این نام کاربری قبلا گرفته شده است.');
      } else if ('email' in body) {
        if (body.email === 'email already exists.') {
          // this.onLoginFail('ایمیل قبلا گرفته شده است.');
        } else {
          // this.onLoginFail('ایمیل شما معتبر نمی‌باشد.');
        }
      }
    } else {
      // TODO
      // error handle
      // this.onLoginFail('خطایی رخ داده');
    }
  }

  counterTrigger () {
    this.setState({
      counter: 60,
    });
    timer.setInterval(
      this,
      'resendCodeCounter',
      () => {
        this.counterCount();
      },
      1000,
    );
  }

  counterCount = () => {
    if (this.state.counter > 0) {
      this.setState({
        counter: this.state.counter - 1,
      });
    } else {
      this.setState({
        counter: 0,
      });
      timer.clearInterval(this);
    }
  }

  remainedTimeText () {
    if (this.state.counter === 0) {
      return null;
    } else {
      return('('+this.state.counter+')');
    }
  }

  renderResendCode () {
    if (this.state.counter === 0) {
      return(
        <TouchableOpacity onPress={this.onResendButtonPress.bind(this)}>
          <Text style={styles.notnow}>دریافت مجدد کد</Text>
        </TouchableOpacity>
      );
    } else {
      return(
        <Text style={styles.resendtext2}>دریافت مجدد کد {this.remainedTimeText()}</Text>
      );
    }

  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.upside}>
            <Text style={styles.addphonenumber}> کد تایید را وارد نمایید: </Text>

            <TextInput
            style={styles.textInput}
            autoFocus={true}
            placeholder="O O O O"
            placeholderTextColor="#acacac"
            value={this.state.verificationCode}
            maxLength = {4}
            keyboardType = 'numeric'
            onChangeText={verificationCode => {
              this.onTextChanged(verificationCode);
            }}
            underlineColorAndroid={'transparent'}
            />
            <View style={styles.sendcodeplz}>
              <Text style={styles.resendtext}>یک کد 4 رقمی به شماره </Text>
              <Text style={styles.resendtext1}>{this.state.cellPhoneNo}</Text>
              <Text style={styles.resendtext}>ارسال شد. لطفا آن را وارد کنید.</Text>
            </View>

            {this.renderResendCode()}

            <TouchableOpacity onPress={this.onWrongNumberButtonPress.bind(this)}>
              <Text style={styles.notnow}>شماره را اشتباه وارد کرده اید؟</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.downside}>
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  textInput: {
    height: 52,
    width:Dimensions.get('window').width/4 ,
    fontSize: 18,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'center',
    color: '#4f4f4f',
    marginBottom:5,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#22c8d4",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 148,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:15,
    marginTop:15,
  },
  buttonview: {
    backgroundColor:"#22c8d4",
    borderRadius: 50,
    height:40,
    width: 140,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  logo:{
    height:140,
    width:100,
  },
  addphonenumber:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:18,
    marginTop:40,
    marginBottom:0,
    color:'#3e3e3e',
  },
  notnow:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
    color:'#12b2ce',
    marginBottom:6,
  },
  logobox:{
    marginTop:50,
  },
  resendtext:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#3e3e3e',
  },
  resendtext1:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#3e3e3e',
  },
  resendtext2:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#acacac',
    marginBottom:8,
  },
  sendcodeplz:{
    marginTop:20,
    marginBottom:20,
  },
  Login1:{
    flexDirection:'column-reverse',
  },
  upside:{
    alignItems:'center',
    flex:4,
    marginTop:0,
  },
  downside:{
    flex:1,
    marginTop:20,
  },
});

export default LoginVerify;
