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

import CalendarScreen from './CalendarScreen';
import InboxScreen from './InboxScreen';
import ListingsScreen from './ListingsScreen';
// import ProfileScreen from './ProfileScreen';
import Profile from './Profile';

class HostScreen extends Component {
  state = { tabIndex: 0 };

  renderContent() {
    switch (this.state.tabIndex) {
      case 0:
        return(<InboxScreen
          role={'host'}
          navigation={this.props.navigation}
          />);
      case 1:
        return(<CalendarScreen role={'host'} navigation={this.props.navigation} />);
      case 2:
        return(<ListingsScreen role={'host'} navigation={this.props.navigation} />);
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
                labelColor="white"
                rippleColor="white"
                activeTab={this.state.tabIndex}
                style={styles.buttomNavigation}
                onTabChange={(newTabIndex) => this._onTabChange(newTabIndex)}
              >
                <Tab
                  barBackgroundColor="#5D4037"
                  label="نامه‌ها"
                  icon={<Icon size={24} color="white" name="mail" />}
                />
                <Tab
                  barBackgroundColor="#37474F"
                  label="تقویم"
                  icon={<Icon size={24} color="white" name="date-range" />}
                />
                <Tab
                  barBackgroundColor="#00796B"
                  label="خانه‌ها"
                  icon={<Icon size={24} color="white" name="account-balance" />}
                />
                <Tab
                  barBackgroundColor="#3E2723"
                  label="نمایه"
                  icon={<Icon size={24} color="white" name="dashboard" />}
                />
        </BottomNavigation>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  buttomNavigation: {
    position: 'absolute',
    bottom: 1,
    width: Dimensions.get('screen').width,
    height: 60,
  },
});

export default HostScreen;
