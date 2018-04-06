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
} from 'react-native';
import CacheStore from 'react-native-cache-store';
// import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Explore from './Explore';
import InboxScreen from './InboxScreen';
// import TripsScreen from './TripsScreen';
import Trips from './Trips';
import Bookmarks from './Bookmarks';
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
  }

  componentDidMount() {
    CacheStore.get('GuestScreen_tabName').then((value) => {
      if (value != null) {
        this.goToTab(value);
        CacheStore.remove('GuestScreen_tabName');
      }
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
    case 'bookmarks':
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
          selected={this.state.selectedTab === 'bookmarks'}
          title="لیست علاقه‌مندی‌ها"
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Image style={styles.icon} source={require('./img/bookmark/bookmark_icon.png')} />}
          renderSelectedIcon={() => <Image style={styles.icon} source={require('./img/bookmark/bookmark_selected_icon.png')} />}
          onPress={() => {
            this.setState({ selectedTab: 'bookmarks' }, this.updateStatusBar);
            if (this.refs.bookmarks) {
              this.refs.bookmarks.refreshScreen();
            }
          }}>
          <Bookmarks
            role={'guest'}
            goToTab={this.goToTab}
            navigation={this.props.navigation}
            ref={'bookmarks'}
            {...this.props}
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
  icon: {
    height: 25,
    width: 30,
    resizeMode: 'contain',
  },
});

export default GuestScreen;
