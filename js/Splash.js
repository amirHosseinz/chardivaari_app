import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Image,
  Text,
  StatusBar,
  NetInfo,
  ToastAndroid,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';
import DeviceInfo from 'react-native-device-info';

import { productionURL, GATrackerId } from './data';


class Splash extends Component {
  constructor(props) {
    super(props);
    this.state={
      token: null,
      username: null,
      retryButtonVisible: false,
      tracker: null,
    };
  }

  componentWillMount () {
    StatusBar.setHidden(true);
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    this.setState({
      tracker: tracker,
    });
    CacheStore.get('token').then((tokenValue) => {
      if (tokenValue == null) {
        // proceed normal
        // console.log('value is null');
        this.trigger();
      } else {
        CacheStore.get('username').then((usernameValue) => {
          this.setState({
            token: tokenValue,
            username: usernameValue,
          }, () => {
            this.trigger();
          });
        });
      }
    });
  }

  // handleFirstConnectivityChange = (isConnected) => {
  //   NetInfo.isConnected.removeEventListener(
  //     'change',
  //     this.handleFirstConnectivityChange
  //   );
  //   this.checkAppUpdate();
  // }

  dispatchConnected = (isConnected) => {
    if (isConnected) {
      this.checkAppUpdate();
    } else {
      this.setRetryButtonVisible();
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'لطفا تلفن همراه خود را به اینترنت متصل نمایید.',
          ToastAndroid.LONG
        );
      }
    }
  }

  trigger () {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.checkAppUpdate();
      } else {
        this.setRetryButtonVisible();
      }
    }).done(() => {
      NetInfo.isConnected.addEventListener('change', this.dispatchConnected);
    });
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

  setRetryButtonVisible = () => {
    this.setState({
      retryButtonVisible: true,
    });
  }

  checkAppUpdate () {
    fetch(productionURL + '/api/check_update/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => this.onCheckUpdateResponseRecieved(response))
    .catch((error) => {
      // network error
      this.setRetryButtonVisible();
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onCheckUpdateResponseRecieved (response) {
    NetInfo.isConnected.removeEventListener(
      'change',
      this.dispatchConnected
    );
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (Number(DeviceInfo.getBuildNumber()) < Number(body.version.min_version)) {
        Alert.alert('نسخه‌ی شما پشتیبانی نمی‌شود، لطفا برنامه را بروزرسانی نمایید.');
      } else if (this.state.token && this.state.username && this.state.username != 'GUEST_USER') {
        this.validateUser();
      } else {
        CacheStore.flush();
        this.resetNavigation('login');
      }
    } else {
      // TODO
      // error handle
    }
  }

  validateUser () {
    fetch(productionURL + '/api/validate/user/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        username: this.state.username,
      }),
    })
    .then((response) => this.onValidateUserResponseRecieved(response))
    .catch((error) => {
      // network error
      this.setRetryButtonVisible();
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onValidateUserResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.validated) {
        CacheStore.set('user', body.user);
        this.state.tracker.setUser(body.user.username);
        this.resetNavigation('guestScreen');
      } else {
        CacheStore.flush();
        this.resetNavigation('login');
      }
    } else if (response.status === 401) {
      // invalid token
      CacheStore.flush();
      this.resetNavigation('login');
    } else {
      // TODO
      // error handle
    }
  }

  onRetryButtonPress () {
    NetInfo.isConnected.removeEventListener(
      'change',
      this.dispatchConnected
    );
    this.trigger();
  }

  renderRetryButton () {
    if (this.state.retryButtonVisible) {
      return(
        <View style={styles.container2}>
          <TouchableOpacity onPress={() => {
            this.onRetryButtonPress();
          }}>
          <Text style={{fontSize:20,fontFamily:'IRANSansMobileFaNum-Medium',color:'#ffffff',textAlign:'center',}}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.container1}>
          <View>
          </View>
          <View style={{marginBottom:0}}>
            <Image source={require('./img/splashlogo.png')} style={styles.splashimg}/>
            <Text style={styles.splashtext}>تریپین</Text>
          </View>
          <View>
          {this.renderRetryButton()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12b2ce',
    alignItems:'center',
    justifyContent:'space-between',
  },
  splashimg:{
    height:120,
    resizeMode:'contain',
  },
  splashtext:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:34,
    color:'#ffffff',
    textAlign:'center',
  },
  container1:{
    flex:1,
    flexDirection:'column',
    justifyContent:'space-between',
  },
  container2:{
    alignItems:'center',
justifyContent:'center',
  },
});

export default Splash;
