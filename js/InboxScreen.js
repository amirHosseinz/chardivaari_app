import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import MessagesListScreen from './MessagesListScreen';
import RequestsListScreen from './RequestsListScreen';

class InboxScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      index: 0,
      routes: [
        { key: '1', title: 'پیام‌ها', },
        { key: '2', title: 'درخواست‌ها' },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  render() {
    return(
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={({route}) => {
          switch (route.key) {
            case '1':
              return(<MessagesListScreen role={this.props.role} navigation={this.props.navigation} />);
            case '2':
              return(<RequestsListScreen role={this.props.role} navigation={this.props.navigation} />);
            default:
              return(<MessagesListScreen role={this.props.role} navigation={this.props.navigation} />);
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

export default InboxScreen;
