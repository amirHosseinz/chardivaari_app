import React, { Component } from 'react';
import {
  Alert,
  Platform,
  PushNotificationIOS,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import PushNotification from 'react-native-push-notification';

import { productionURL } from './data';

class PushNotificationController extends Component {

  componentWillMount () {
    // PushNotificationIOS.addEventListener('register', function(token) {
    //   CacheStore.get('token').then((tokenValue) => {
    //     if (tokenValue != null) {
    //       fetch(productionURL + '/api/push_notif/register_token/', {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Token ' + tokenValue,
    //         },
    //         body: JSON.stringify({
    //           token: token,
    //           device: 'ios',
    //         }),
    //       })
    //       .then((response) => {
    //         console.log("response#######");
    //         console.log(response);
    //       })
    //       .catch((error) => {
    //         // network error
    //       });
    //     }
    //   });
    //   console.log("on event register...");
    //   Alert.alert(token);
    // });
    // PushNotificationIOS.addEventListener('registrationError', function(data) {
    //   console.log("on event registrationError...");
    //   console.log(data);
    //   Alert.alert('registrationError');
    // });
    // PushNotificationIOS.addEventListener('notification', function(notification){
    //   console.log("on event notification...");
    //   console.log(notification);
    //   Alert.alert(String(notification));
    // });
  }

  componentDidMount () {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        Alert.alert('onRegister via' + token.os);
        CacheStore.get('token').then((tokenValue) => {
          if (tokenValue != null) {
            fetch(productionURL + '/api/push_notif/register_token/', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + tokenValue,
              },
              body: JSON.stringify({
                token: token.token,
                device: token.os,
              }),
            })
            .then((response) => {
              console.log("response#######");
              console.log(response);
            })
            .catch((error) => {
              // network error
            });
          }
        });
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log("onNotification##############");
        console.log( 'NOTIFICATION:', notification );
        // process the notification
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      senderID: "139971053396",
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  render () {
    return null;
  }
}

export default PushNotificationController;
