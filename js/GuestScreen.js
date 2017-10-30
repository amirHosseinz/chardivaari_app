import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  Image,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import timer from 'react-native-timer';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Explore from './Explore';
import InboxScreen from './InboxScreen';
// import TripsScreen from './TripsScreen';
import Trips from './Trips';
// import ProfileScreen from './ProfileScreen';
import Profile from './Profile';

// import { fetch } from 'fetch';
// import { AIRBNB_API } from './data';
// import type { Listing } from './data';


class GuestScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tabIndex: 3,
      backPressedBefor: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({
      backPressedBefor: false,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    timer.clearTimeout(this);
  }

  handleBackButton = () => {
    if (this.state.backPressedBefor === true) {
      BackHandler.exitApp();
    } else {
      ToastAndroid.show(
        'برای خروج دکمه‌ی بازگشت را مجددا فشار دهید.',
        ToastAndroid.SHORT,
      );
      this.setState({
        backPressedBefor: true,
      });
      timer.setTimeout(
        this,
        'resetBackButtonState',
        () => {
          this.resetBackButtonState();
        },
        1000,
      );
    }
    return true;
  }

  resetBackButtonState = () => {
    this.setState({
      backPressedBefor: false,
    });
  }

  renderContent () {
    switch (this.state.tabIndex) {
      case 0:
        return(<Profile role={'guest'} goToTab={this.goToTab} navigation={this.props.navigation} />);
      case 1:
        return(<InboxScreen role={'guest'} goToTab={this.goToTab} navigation={this.props.navigation} />);
      case 2:
        return(<Trips role={'guest'} goToTab={this.goToTab} navigation={this.props.navigation} />);
      case 3:
        return(<Explore role={'guest'} goToTab={this.goToTab} navigation={this.props.navigation} />);
      default:
        return(<Explore role={'guest'} goToTab={this.goToTab} navigation={this.props.navigation} />);
      }
  }

  goToTab = (tabName) => {
    switch(tabName) {
    case 'profile':
      this.setState({
        tabIndex: 0,
      });
      break;
    case 'inboxScreen':
      this.setState({
        tabIndex: 1,
      });
      break;
    case 'trips':
      this.setState({
        tabIndex: 2,
      });
      break;
    case 'explore':
      this.setState({
        tabIndex: 3,
      });
      break;
    default:
    }
  }

  _onTabChange (newTabIndex) {
    if (this.state.tabIndex !== newTabIndex){
      this.setState({ tabIndex: newTabIndex});
    }
  }

  render () {
    return (
      <View style={styles.container}>

        {this.renderContent()}

        <BottomNavigation
              labelColor="#a0a0a0"
              activeTab={this.state.tabIndex}
              rippleColor="#f56e4e"
              activeLabelColor="#f56e4e"
              style={{ height: 62,  elevation: 8, position: 'absolute', left: 0, bottom: 0, right: 0 }}
              innerStyle={{ paddingBottom: 0}}
              onTabChange={(newTabIndex) => this._onTabChange(newTabIndex)}
              shifting={false}
              >
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>حساب کاربری</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="account-circle" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="account-circle" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>پیام ها</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="forum" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="forum" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>سفرها</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="public" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="public" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>جستجو</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="search" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="search" />}
                />
        </BottomNavigation>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttomNavFont: {
    fontFamily: "IRANSans",
    fontSize: 12,
  }
});

export default GuestScreen;
