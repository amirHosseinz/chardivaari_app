import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import CacheStore from 'react-native-cache-store';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

// import SearchResults from './SearchResults';
// import SearchResultsMapView from './SearchResultsMapView';

class LoginSignupTabView extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'ورود', },
      { key: '2', title: 'ایجاد حساب کاربری' },
    ],
  };

  componentWillMount () {
    // TODO
    CacheStore.get('token').then((value) => {
      if (value == null) {
        // console.log('value is null');
      } else {
        this.props.navigation.navigate('guestScreen');
      }
    });
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={({route}) => {
          switch (route.key) {
            case '1':
              return(<LoginScreen navigation={this.props.navigation} />);
            case '2':
              return(<SignupScreen navigation={this.props.navigation} />);
            default:
              return(<LoginScreen navigation={this.props.navigation} />);
          }
        }}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        onRequestChangeTab={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginSignupTabView;
