import React from 'react';
import { Scene, Router } from 'react-native-router-flux';

import GuestScreen from './GuestScreen';
import HostScreen from './HostScreen';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';


const RouterComponent = () => {
  return(
    <Router>
      <Scene key='auth' >
        <Scene
        key='login'
        component={LoginScreen}
        title='Login Screen'
        initial
        />
      </Scene>

      <Scene key='main' >
        <Scene key='mainScreen' component={MainScreen} title='Main Screen' />
      </Scene>

      <Scene key='guest' >
        <Scene key='guestScreen' component={GuestScreen} title='Guest Side here' />
      </Scene>

      <Scene key='host' >
        <scene key='hostScreen' component={HostScreen} title='Host side here' />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
