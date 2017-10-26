import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';

import { testURL, productionURL, currentVersion } from './data';


class Splash extends Component {
  constructor(props) {
    super(props);
    this.state={
      token: null,
      username: null,
    };
  }

  componentWillMount () {
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
      // console.log(error);
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
      // console.log(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onValidateUserResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.validated) {
        this.resetNavigation('guestScreen');
      } else {
        CacheStore.flush();
        this.resetNavigation('login');
      }
    } else {
      // TODO
      // error handle
    }
  }

  render () {
    return(
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
});

export default Splash;
