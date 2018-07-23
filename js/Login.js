import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';
import DeviceInfo from 'react-native-device-info';
import { persianArabicToEnglishDigits } from './tools/castToEnglishDigits';

import { productionURL, GATrackerId } from './data';


class Login extends Component {
  constructor (props) {
    super(props);
    this.state={
      cellPhoneNo: '',
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('Login');
    CacheStore.get('token').then((value) => {
      if (value == null) {
        // proceed normal
        // console.log('value is null');
      } else {
        CacheStore.get('username').then((value) => {
          if (value === 'GUEST_USER') {
            // do nothing
            // maybe user motivates to login
          } else {
            this.resetNavigation('guestScreen');
          }
        });
      }
    });
  }

  skipLogin () {
    fetch(productionURL + '/auth/api/user/login_guest/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => this.onLoginGuestResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onLoginGuestResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      CacheStore.set('token', body.token);
      CacheStore.set('username', body.user.username);
      CacheStore.set('user', body.user);
      this.resetNavigation('guestScreen');
    } else {
      // TODO
      // error handle
    }
  }

  checkPhoneNumber () {
    fetch(productionURL + '/auth/api/signup/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cell_phone: this.state.cellPhoneNo,
        app_version: DeviceInfo.getBuildNumber(),
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onResponseRecieved(response) {
    if (response.status === 201) {
      body = JSON.parse(response._bodyText);
      this.props.navigation.navigate('loginVerify', {
        cellPhoneNo: this.state.cellPhoneNo,
        smsCenter: body.sms_center,
        hasAccount: body.has_account,
        installReferralCode: body.install_referral_code,
      });
    } else if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      console.log("the sms_center is: " + body.sms_center)
      console.log("the install_referral_code is: " + body.sms_center)
      this.props.navigation.navigate('loginVerify', {
        cellPhoneNo: this.state.cellPhoneNo,
        smsCenter: body.sms_center,
        hasAccount: body.has_account,
        installReferralCode: body.install_referral_code,
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
      // this.onLoginFail('خطایی رخ داده');
    }
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

  onTextChanged (cellPhoneNo) {
    cellPhoneNo = persianArabicToEnglishDigits(cellPhoneNo);
    this.setState({
      cellPhoneNo
    });
    if (cellPhoneNo.length == 11 &&
        cellPhoneNo.search('09') == 0) {
        Alert.alert(
          'تایید شماره تلفن',
          'آیا شماره‌ی شما ' + cellPhoneNo + ' می‌باشد؟',
          [
            {text: 'بله', onPress: () => {
              this.checkPhoneNumber();
            },},
            {text: 'خیر', onPress: () => {},},
          ],
          { cancelable: false }
        );
    }
  }

  getConfirmationCode () {
    if (this.state.cellPhoneNo.length < 11) {
      Alert.alert('لطفا شماره همراه خود را کامل وارد نمایید.');
    } else if (this.state.cellPhoneNo.search('09') != 0) {
      Alert.alert('لطفا شماره خود را در قالب گفته شده وارد نمایید.');
    } else {
      Alert.alert(
        'تایید شماره تلفن',
        'آیا شماره‌ی شما ' + this.state.cellPhoneNo + ' می‌باشد؟',
        [
          {text: 'بله', onPress: () => {
            this.checkPhoneNumber();
          },},
          {text: 'خیر', onPress: () => {},},
        ],
        { cancelable: false }
      );
    }
  }

  render () {
    return(
      <View style={styles.container0}>
      <TouchableOpacity onPress={this.skipLogin.bind(this)}>
      <View style={styles.rightAlignmentBox}>
        <Text style={styles.notnow}>
        فعلا بی‌خیال
        </Text>
      </View>
      </TouchableOpacity>
        <View style={styles.container}>

          <View style={styles.logobox}>
          <Image source={require('./img/aboutlogo.png')}
            style={styles.logo}/>
          </View>
          <Text style={styles.addphonenumber}> لطفا شماره موبایل خود را وارد کنید: </Text>

          <TextInput
            style={styles.textInput}
            autoFocus={true}
            placeholder="09120000000"
            placeholderTextColor="#acacac"
            value={this.state.cellPhoneNo}
            maxLength = {11}
            keyboardType = 'phone-pad'
            onChangeText={cellPhoneNo => {
              this.onTextChanged(cellPhoneNo);
            }}
            underlineColorAndroid={'transparent'}
          />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    height: 52,
    width:Dimensions.get('window').width-50 ,
    fontSize: 18,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'center',
    color: '#4f4f4f',
    marginBottom:12,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily: "IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#22bdd4",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 188,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:15,
    marginTop:15,
  },
  buttonview: {
    backgroundColor:"#22bdd4",
    borderRadius: 50,
    height:40,
    width: 180,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  logo:{
    height:100,
    resizeMode:'contain',
  },
  addphonenumber:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
    marginTop:30,
    marginBottom:10,
    color:'#3e3e3e',
  },
  rightAlignmentBox: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  notnow:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
    color:'#22bdd4',
    marginRight:25,
    marginTop:25,
  },
  logobox:{
    marginTop:50,
  },
});

export default Login;
