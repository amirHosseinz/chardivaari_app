import React, { Component } from 'react';
import ReactNative, { View, Text } from 'react-native';

import AppNavigator from './AppNavigator';

class App extends Component {

  componentWillMount () {
    try {
      ReactNative.I18nManager.allowRTL(false);
    } catch (e) {
      console.log(e);
    }
  }

  render () {
    return (
      <AppNavigator/>
    );
  }
}

export default App;
