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
      ToastAndroid.show(
        'برای خروج دکمه‌ی بازگشت را مجددا فشار دهید.',
        ToastAndroid.SHORT,
      );
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    timer.clearTimeout(this);
  }

  render () {
    return(
      <AppNavigator navigation={this.props.navigation} />
    );
  }

}

export default AppWithNavigationState;
