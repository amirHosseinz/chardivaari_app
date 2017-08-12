import React, { PropTypes } from 'react';
import { StackNavigator } from 'react-navigation';
import Routes from './Routes';

export const AppNavigator = StackNavigator(
  Routes
);

const AppWithNavigationState = ({navigation}) => (
  <AppNavigator navigation = {navigation} />
);

export default AppWithNavigationState;
