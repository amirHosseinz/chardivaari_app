import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Image,
  Text,
  StatusBar,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import KeepAwake from 'react-native-keep-awake';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { productionURL, currentVersion, GATrackerId } from './data';


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
    KeepAwake.activate();
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    this.setState({
      tracker: tracker,
    });
    CacheStore.get('token').then((tokenValue) => {
      if (tokenValue == null) {
        // proceed normal
        // console.log('value is null');
        this.checkAppUpdate();
      } else {
        CacheStore.get('username').then((usernameValue) => {
          this.setState({
            token: tokenValue,
            username: usernameValue,
          }, () => {
            this.checkAppUpdate();
          });
        });
      }
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

  setRetryButtonVisible () {
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
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (Number(currentVersion) < Number(body.version.min_version)) {
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

  renderRetryButton () {
    if (this.state.retryButtonVisible) {
      return(
        <View style={styles.container2}>
          <TouchableOpacity onPress={() =>{
            this.checkAppUpdate();
          }}>
          <Text style={{fontSize:20,fontFamily:'Vazir-Medium',color:'#ffffff',textAlign:'center',}}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.container1}>
          <Image source={require('./img/splashlogo.png')} style={styles.splashimg}/>
          <Text style={styles.splashtext}>تریپین</Text>
      </View>
      {this.renderRetryButton()}
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
    fontFamily:'Vazir-Medium',
    fontSize:34,
    marginBottom:180,
    color:'#ffffff',
  },
  container1:{
    alignItems:'center',
justifyContent:'center',
marginTop:100,
  },
  container2:{
    alignItems:'center',
justifyContent:'center',
marginBottom:45,
  },
});

export default Splash;
