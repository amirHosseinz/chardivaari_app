import React, { Component } from 'react';
import {
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import Routes from './Routes';
import timer from 'react-native-timer';
import KeepAwake from 'react-native-keep-awake';

export const AppNavigator = StackNavigator(
  Routes
);

// const AppWithNavigationState = ({navigation}) => (
//   <AppNavigator navigation = {navigation} />
// );

class AppWithNavigationState extends Component {
  constructor(props) {
    super(props);
    this.state={
      backPressedBefore: false,
    };
  }

  handleBackButton = () => {
    if (this.state.backPressedBefore === true) {
      BackHandler.exitApp();
    } else {
      this.setState({
        backPressedBefore: true,
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
      backPressedBefore: false,
    });
  }

  componentWillMount () {
    KeepAwake.activate();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    timer.clearTimeout(this);
    KeepAwake.deactivate();
  }

  render () {
    return(
      <AppNavigator navigation={this.props.navigation} />
    );
  }

}

export default AppWithNavigationState;
