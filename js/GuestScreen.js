import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  Image,
  StatusBar,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
// import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeepAwake from 'react-native-keep-awake';

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
  }

  componentDidMount() {
    KeepAwake.activate();
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
    default:
    }
    this.updateStatusBar();
  }

  updateStatusBar = () => {
    if (this.state.selectedTab === 'profile') {
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor('#eeeeee');
      StatusBar.setBarStyle('dark-content');
      // return(
      //   <StatusBar
      //     backgroundColor="#eeeeee"
      //     barStyle="dark-content" />
      // );
    } else {
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor('#0094ae');
      StatusBar.setBarStyle('light-content');
      // return(
      //   <StatusBar
      //     backgroundColor="#0094ae"
      //     barStyle="light-content" />
      // );
    }
  }

  render () {
    return (
      <View style={styles.container}>

        <TabNavigator
        tabBarStyle={{height:51}}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="حساب کاربری"
            selectedTitleStyle={{color:'#f56e4e',fontFamily:'Vazir',fontSize:9,marginTop:0}}
            titleStyle={{color:'#a0a0a0',fontFamily:'Vazir',fontSize:9,marginTop:0}}
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
            titleStyle={{color:'#a0a0a0',fontFamily:'Vazir',fontSize:9,marginTop:-1,}}
            selectedTitleStyle={{color:'#f56e4e',fontFamily:'Vazir',fontSize:9,marginTop:-1}}
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
            selectedTitleStyle={{color:'#f56e4e',fontFamily:'Vazir',fontSize:9,marginTop:-1}}
            titleStyle={{color:'#a0a0a0',fontFamily:'Vazir',fontSize:9,marginTop:-1}}
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
            selectedTitleStyle={{color:'#f56e4e',fontFamily:'Vazir',fontSize:9,marginTop:-1}}
            titleStyle={{color:'#a0a0a0',fontFamily:'Vazir',fontSize:9,marginTop:-1}}
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

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GuestScreen;
