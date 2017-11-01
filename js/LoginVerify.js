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
import KeepAwake from 'react-native-keep-awake';

import { testURL, productionURL } from './data';


class LoginVerify extends Component {
  constructor (props) {
    super(props);
    this.state={
      cellPhoneNo: '',
      verificationCode: null,
      smsCenter: null,
      subscription: null,
    };
  }

  componentWillMount () {
    KeepAwake.activate();
    this.setState({
      cellPhoneNo: this.props.navigation.state.params.cellPhoneNo,
      smsCenter: this.props.navigation.state.params.smsCenter,
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
      if (body.token != null) {
        CacheStore.set('token', body.token);
        CacheStore.set('username', body.user.username);
        CacheStore.set('user', body.user);
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
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  onResendButtonPress () {
    this.state.subscription.remove();
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

            <TouchableOpacity onPress={this.onResendButtonPress.bind(this)}>
              <Text style={styles.notnow}>دریافت مجدد کد</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onWrongNumberButtonPress.bind(this)}>
              <Text style={styles.notnow}>شماره را اشتباه وارد کرده اید؟</Text>
            </TouchableOpacity>
          </View>

        <View style={styles.downside}>
          <TouchableOpacity style={styles.buttontouch} onPress={this.checkVerificationCode.bind(this)}>
            <View style={styles.buttonview}>
              <Text style={styles.reservebuttontext}>ادامه</Text>
            </View>
          </TouchableOpacity>
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
    fontFamily: 'Vazir',
    textAlign: 'center',
    color: '#4f4f4f',
    marginBottom:5,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  reservebuttontext: {
    fontSize: 20,
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
    width: 148,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:15,
    marginTop:15,
  },
  buttonview: {
    backgroundColor:"#00cecc",
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
    fontFamily:'Vazir-Medium',
    fontSize:18,
    marginTop:40,
    marginBottom:0,
    color:'#3e3e3e',
  },
  notnow:{
    fontFamily:'Vazir-Medium',
    fontSize:16,
    color:'#00a8a6',
    marginBottom:10,
  },
  logobox:{
    marginTop:50,
  },
  resendtext:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'Vazir-Light',
  },
  resendtext1:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'Vazir-Medium',
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
  }
});

export default LoginVerify;
