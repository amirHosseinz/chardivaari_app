import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeepAwake from 'react-native-keep-awake';

// import CalendarScreen from './CalendarScreen';
import ReserveList from './ReserveList';
import InboxScreen from './InboxScreen';
// import ListingsScreen from './ListingsScreen';
import HouseListScreen from './HouseListScreen';
// import ProfileScreen from './ProfileScreen';
import Profile from './Profile';

class HostScreen extends Component {
  state = { tabIndex: 0 };

  componentDidMount () {
    KeepAwake.activate();
  }

  renderContent() {
    switch (this.state.tabIndex) {
      case 0:
        return(<InboxScreen
          role={'host'}
          navigation={this.props.navigation}
          />);
      case 1:
        return(<ReserveList role={'host'} navigation={this.props.navigation} />);
      case 2:
        return(<HouseListScreen role={'host'} navigation={this.props.navigation} />);
      case 3:
        return(<Profile role={'host'} navigation={this.props.navigation} />);
      default:
        return(<InboxScreen role={'host'} navigation={this.props.navigation} />);
      }
  }

  _onTabChange(newTabIndex){
    if (this.state.tabIndex !== newTabIndex){
      this.setState({ tabIndex: newTabIndex});
    }
  }

  render() {
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
          shifting={false}>
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>پیام ها</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="forum" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="forum" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>رزرو ها</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="date-range" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="date-range" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>خانه ها</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="account-balance" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="account-balance" />}
                />
                <Tab
                  barBackgroundColor="#fff"
                  label={<Text style={styles.buttomNavFont}>میزبان تریپین</Text>}
                  icon={<Icon size={24} color="#a0a0a0" name="dashboard" />}
                  activeIcon={<Icon size={24} color="#f56e4e" name="dashboard" />}
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
  buttomNavigation: {
    position: 'absolute',
    bottom: 1,
    width: Dimensions.get('screen').width,
    height: 60,
  },
  buttomNavFont: {
    fontFamily: "IRANSans",
    fontSize: 12,
  },
});

export default HostScreen;
