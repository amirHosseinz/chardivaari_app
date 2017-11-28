import React, { Component } from 'react';
import {
  BackHandler,
  ToastAndroid,
  StatusBar,
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

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
    timer.clearTimeout(this);
  }

  render () {
    return(
      <AppNavigator
        navigation={this.props.navigation}
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getCurrentRouteName(currentState);
          const prevScreen = getCurrentRouteName(prevState);

          if (prevScreen !== currentScreen) {
            switch (currentScreen) {
              case 'splash':
                StatusBar.setHidden(true);
                break;
              case 'login':
                StatusBar.setHidden(false);
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor('#eeeeee');
                StatusBar.setBarStyle('dark-content');
                break;
              case 'houseDetail':
                StatusBar.setHidden(false);
                StatusBar.setTranslucent(true);
                StatusBar.setBarStyle('light-content');
                StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.25)');
                break;
              case 'guestScreen':
                StatusBar.setHidden(false);
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor('#0094ae');
                StatusBar.setBarStyle('light-content');
                break;
              case 'hostScreen':
                StatusBar.setHidden(false);
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor('#0094ae');
                StatusBar.setBarStyle('light-content');
                break;
              case 'requestBookScreen':
                StatusBar.setHidden(false);
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor('#eeeeee');
                StatusBar.setBarStyle('dark-content');
                break;
              default:
          }}
        }}
      />
    );
  }

}

export default AppWithNavigationState;
