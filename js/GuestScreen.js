import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  Image,
  StackNavigator,
} from 'react-native';
import BottomNavigation, { Tab } from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SearchRoom from './SearchRoom';
import InboxScreen from './InboxScreen';
import TripsScreen from './TripsScreen';
import ProfileScreen from './ProfileScreen';

// import { fetch } from 'fetch';
// import { AIRBNB_API } from './data';
// import type { Listing } from './data';


class GuestScreen extends Component {
  state = { tabIndex: 0 };

  componentWillMount() {
    this.setState({ tabIndex: 0});
  }

  renderContent() {
    switch (this.state.tabIndex) {
      case 0:
        return(<SearchRoom
          role={'guest'}
          navigation={this.props.navigation}
          />);
      case 1:
        return(<TripsScreen role={'guest'} navigation={this.props.navigation} />);
      case 2:
        return(<InboxScreen role={'guest'} navigation={this.props.navigation} />);
      case 3:
        return(<ProfileScreen role={'guest'} navigation={this.props.navigation} />);
      default:
        return(<SearchRoom role={'guest'} navigation={this.props.navigation} />);
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
                  barBackgroundColor="#37474F"
                  label="کاوش"
                  icon={<Icon size={24} color="white" name="explore" />}
                />
                <Tab
                  barBackgroundColor="#00796B"
                  label="سفرها"
                  icon={<Icon size={24} color="white" name="flight-takeoff" />}
                />
                <Tab
                  barBackgroundColor="#5D4037"
                  label="نامه‌ها"
                  icon={<Icon size={24} color="white" name="mail" />}
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

export default GuestScreen;
