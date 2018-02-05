import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  Image,
  StatusBar,
  BackHandler,
  ToastAndroid,
  Platform,
  PushNotificationIOS,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
// import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';

import Explore from './Explore';
import InboxScreen from './InboxScreen';
// import TripsScreen from './TripsScreen';
import Trips from './Trips';
// import ProfileScreen from './ProfileScreen';
import Profile from './Profile';

import { productionURL } from './data';

// import { fetch } from 'fetch';
// import { AIRBNB_API } from './data';
// import type { Listing } from './data';


class GuestScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedTab: 'explore',
      requestsBadgeNum: 0,
      messagesBadgeNum: 0,
      tripsBadgeNum: 0,
      token: null,
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
    this.updateStatusBar();
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

  componentDidMount() {
    CacheStore.get('GuestScreen_tabName').then((value) => {
      if (value != null) {
        this.goToTab(value);
        CacheStore.remove('GuestScreen_tabName');
      }
    });
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

  setToken (token) {
    if (token != null) {
      this.setState({
        token: token,
      }, () => {
        this.fetchBadges();
      });
    }
  }

  fetchBadges () {
    fetch(productionURL + '/api/main_screen/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: 'guest',
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
      this.setState({
        requestsBadgeNum: body.requests_count,
        messagesBadgeNum: body.messages_count,
        tripsBadgeNum: body.trips_count,
      });
    } else {
      // TODO
      // an eror handler
    }
  }

  setRequestsBadgeNum = (value) => {
    this.setState({
      requestsBadgeNum: value,
    });
  }

  setMessagesBadgeNum = (value) => {
    this.setState({
      messagesBadgeNum: value,
    });
  }

  setTripsBadgeNum = (value) => {
    this.setState({
      tripsBadgeNum: value,
    });
  }

  goToTab = (tabName) => {
    switch(tabName) {
    case 'profile':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'inboxScreen':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'trips':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'explore':
      this.setState({
        selectedTab: tabName,
      });
      break;
    default:
    }
    this.updateStatusBar();
  }

  updateStatusBar = () => {
    if (this.state.selectedTab === 'profile') {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('#eeeeee');
      }
      // return(
      //   <StatusBar
      //     backgroundColor="#eeeeee"
      //     barStyle="dark-content" />
      // );
    } else {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('#0094ae');
      }
      // return(
      //   <StatusBar
      //     backgroundColor="#0094ae"
      //     barStyle="light-content" />
      // );
    }
  }

  render () {
    return (
      <TabNavigator
      tabBarStyle={{height:51}}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="حساب کاربری"
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Icon size={23} color="#bbbbbb" name="account-circle" />}
          renderSelectedIcon={() => <Icon size={23} color="#f56e4e" name="account-circle" />}
          onPress={() => {
            this.setState({ selectedTab: 'profile' }, this.updateStatusBar);
          }}>
          <Profile
            role={'guest'}
            goToTab={this.goToTab}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'inboxScreen'}
          title="پیام‌ها"
          titleStyle={styles.titleStyle}
          selectedTitleStyle={styles.selectedTitleStyle}
          renderIcon={() => <Icon size={22} color="#bbbbbb" name="forum"/>}
          renderSelectedIcon={() => <Icon size={22} color="#f56e4e" name="forum" />}
          onPress={() => {
            this.setState({ selectedTab: 'inboxScreen' }, this.updateStatusBar);
          }}
          renderBadge={() => {
            if ((Number(this.state.requestsBadgeNum) + Number(this.state.messagesBadgeNum)) > 0) {
              return(
                <View style={{paddingTop:1}}>
                  <View style={{backgroundColor:'#f56e4e',height:6,width:6,borderRadius:3,borderColor:"#f8f8f8",borderWidth:0,alignItems:'center',justifyContent:'center',marginRight:29,paddingBottom:2,}}>
                  </View>
                </View>
              );
            }
          }}>
          <InboxScreen
            role={'guest'}
            goToTab={this.goToTab}
            setMessagesBadgeNum={this.setMessagesBadgeNum}
            setRequestsBadgeNum={this.setRequestsBadgeNum}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'trips'}
          // tabStyle={{flex: 1, flexDirection: 'column', justifyContent:'flex-end'}}
          title="سفرها"
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Icon size={23} color="#bbbbbb" name="public"/>}
          renderSelectedIcon={() => <Icon size={23} color="#f56e4e" name="public" />}
          onPress={() => {
            this.setState({ selectedTab: 'trips' }, this.updateStatusBar);
          }}
          renderBadge={() => {
            if (Number(this.state.tripsBadgeNum) > 0) {
              return(
                <View style={{paddingTop:2}}>
                  <View style={{backgroundColor:'#f56e4e',height:6,width:6,borderRadius:3,borderColor:"#f8f8f8",borderWidth:0,alignItems:'center',justifyContent:'center',marginRight:30,paddingBottom:0,}}>
                  </View>
                </View>
              );
            }
          }}>
          <Trips
            role={'guest'}
            goToTab={this.goToTab}
            setTripsBadgeNum={this.setTripsBadgeNum}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'explore'}
          title="جستجو"
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Icon size={24} color="#bbbbbb" name="search" />}
          renderSelectedIcon={() => <Icon size={24} color="#f56e4e" name="search" />}
          onPress={() => this.setState({ selectedTab: 'explore' }, this.updateStatusBar)}>
          <Explore
            role={'guest'}
            goToTab={this.goToTab}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: '#a0a0a0',
    fontFamily: 'IRANSansMobileFaNum-Medium',
    fontSize: 9,
    ...Platform.select({
      android: {
        marginTop: -1,
      },
      ios: {
        marginBottom: 6,
      },
    }),
  },
  selectedTitleStyle: {
    color:'#f56e4e',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:9,
    ...Platform.select({
      ios: {
        marginBottom: 6,
      },
      android: {
        marginTop:-1,
      },
    }),
  },
});

export default GuestScreen;
