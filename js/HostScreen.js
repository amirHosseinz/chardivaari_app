import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
// import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CacheStore from 'react-native-cache-store';

// import CalendarScreen from './CalendarScreen';
import ReserveList from './ReserveList';
import InboxScreen from './InboxScreen';
// import ListingsScreen from './ListingsScreen';
import HouseListScreen from './HouseListScreen';
// import ProfileScreen from './ProfileScreen';
import Profile from './Profile';
import { productionURL } from './data';

class HostScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      selectedTab: 'reserves',
      requestsBadgeNum: 0,
      messagesBadgeNum: 0,
      reservesBadgeNum: 0,
    };
  }

  componentWillMount () {
    this.updateStatusBar();
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken (value) {
    if (value != null) {
      this.setState({
        token: value,
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
        role: 'host',
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
        requestsBadgeNum: Number(body.requests_count),
        messagesBadgeNum: Number(body.messages_count),
        reservesBadgeNum: Number(body.reserves_count),
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

  setReservesBadgeNum = (value) => {
    this.setState({
      reservesBadgeNum: value,
    });
  }

  goToTab = (tabName) => {
    switch(tabName) {
    case 'reserves':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'inboxScreen':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'listings':
      this.setState({
        selectedTab: tabName,
      });
      break;
    case 'profile':
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

  render() {
    return (
      <View style={styles.container}>

      <TabNavigator
        tabBarStyle={{height:51}}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title='میزبان تریپین'
          selectedTitleStyle={styles.hostSelectedTitleStyle}
          titleStyle={styles.hostTitleStyle}
          renderIcon={() => <Icon size={23} color="#bbbbbb" name="dashboard" />}
          renderSelectedIcon={() => <Icon size={23} color="#f56e4e" name="dashboard" />}
          onPress={() => this.setState({ selectedTab: 'profile' }, this.updateStatusBar)}>
          <Profile role={'host'} navigation={this.props.navigation}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'inboxScreen'}
          title='پیام‌ها'
          titleStyle={styles.titleStyle}
          selectedTitleStyle={styles.selectedTitleStyle}
          renderIcon={() => <Icon size={22} color="#bbbbbb" name="forum"/>}
          renderSelectedIcon={() => <Icon size={22} color="#f56e4e" name="forum" />}
          onPress={() => this.setState({ selectedTab: 'inboxScreen' }, this.updateStatusBar)}
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
            role={'host'}
            navigation={this.props.navigation}
            setMessagesBadgeNum={this.setMessagesBadgeNum}
            setRequestsBadgeNum={this.setRequestsBadgeNum}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'listings'}
          // tabStyle={{flex: 1, flexDirection: 'column', justifyContent:'flex-end'}}
          title='خانه‌ها'
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Icon size={22} color="#bbbbbb" name="account-balance"/>}
          renderSelectedIcon={() => <Icon size={22} color="#f56e4e" name="account-balance" />}
          onPress={() => this.setState({ selectedTab: 'listings' }, this.updateStatusBar)}>
          <HouseListScreen
            role={'host'}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'reserves'}
          title='رزروها'
          selectedTitleStyle={styles.selectedTitleStyle}
          titleStyle={styles.titleStyle}
          renderIcon={() => <Icon size={23} color="#bbbbbb" name="date-range" />}
          renderSelectedIcon={() => <Icon size={23} color="#f56e4e" name="date-range" />}
          onPress={() => this.setState({ selectedTab: 'reserves' }, this.updateStatusBar)}
          renderBadge={() => {
            if (Number(this.state.reservesBadgeNum) > 0) {
              return(
                <View style={{paddingTop:1}}>
                  <View style={{backgroundColor:'#f56e4e',height:6,width:6,borderRadius:3,borderColor:"#f8f8f8",borderWidth:0,alignItems:'center',justifyContent:'center',marginRight:29,paddingBottom:2,}}>
                  </View>
                </View>
              );
            }
          }}>
          <ReserveList
            role={'host'}
            navigation={this.props.navigation}
            setReservesBadgeNum={this.setReservesBadgeNum}
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
  titleStyle: {
    color:'#a0a0a0',
    fontFamily:'IRANSansMobileFaNum',
    fontSize:9,
    ...Platform.select({
      android: {
        marginTop:-1,
      },
      ios: {
        marginBottom: 6,
      },
    }),
  },
  selectedTitleStyle: {
    color:'#f56e4e',
    fontFamily:'IRANSansMobileFaNum',
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
  hostTitleStyle: {
    color:'#a0a0a0',
    fontFamily:'IRANSansMobileFaNum',
    fontSize:9,
    ...Platform.select({
      android: {
        marginTop: 0,
      },
      ios: {
        marginBottom: 6,
      },
    }),
  },
  hostSelectedTitleStyle: {
    color:'#f56e4e',
    fontFamily:'IRANSansMobileFaNum',
    fontSize:9,
    ...Platform.select({
      android: {
        marginTop:0,
      },
      ios: {
        marginBottom: 6,
      },
    }),
  },
});

export default HostScreen;
