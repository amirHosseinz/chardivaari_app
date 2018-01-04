import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { GATrackerId } from './data';
import MessagesListScreen from './MessagesListScreen';
import RequestsListScreen from './RequestsListScreen';

class InboxScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      index: 1,
      routes: [
        { key: '2', title: 'پــیــام هــا', },
        { key: '1', title: 'درخواست‌ها' },
      ],
      messagesUnreadCount: 0,
      requestsUnreadCount: 0,
      tracker: null,
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('RequestsListScreen');
    this.setState({
      tracker: tracker,
    });
  }

  setMessagesUnreadCount = (value) => {
    this.setState({
      messagesUnreadCount: value,
    });
    if (this.props.setMessagesBadgeNum) {
      this.props.setMessagesBadgeNum(value);
    }
  }

  setRequestsUnreadCount = (value) => {
    this.setState({
      requestsUnreadCount: value,
    });
    if (this.props.setRequestsBadgeNum) {
      this.props.setRequestsBadgeNum(value);
    }
  }

  _handleIndexChange = (index) => {
    if (index === 0) {
      this.state.tracker.trackScreenView('MessagesListScreen');
    } else if (index === 1) {
      this.state.tracker.trackScreenView('RequestsListScreen');
    }
    this.setState({ index });
  }

  onRenderBadge = (scene) => {
    if (scene.index === 1) {
      // requests
      if (this.state.requestsUnreadCount != 0) {
        return(<View style={styles.badgeview}>
          <Text style={styles.textbadge}>
            {this.state.requestsUnreadCount}
          </Text>
          </View>);
      }
    }
    if (scene.index === 0) {
      // messages
      if (this.state.messagesUnreadCount != 0) {
        return(<View style={styles.badgeview}>
          <Text style={styles.textbadge}>
            {this.state.messagesUnreadCount}
          </Text>
          </View>);
      }
    }
  }

  _renderHeader = props => <TabBar
    labelStyle={styles.labelstyle}
    //tabStyle={styles.tabStyle}
    pressColor={'#636877'}
    style={styles.styletab}
    indicatorStyle={{backgroundColor:'white', height:2,}}
    renderBadge={this.onRenderBadge}
    {...props}
    />;

  render() {
    return(
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={({route}) => {
          switch (route.key) {
            case '1':
              return(<RequestsListScreen
                role={this.props.role}
                setCount={this.setRequestsUnreadCount}
                navigation={this.props.navigation} />);
            case '2':
              return(<MessagesListScreen
                role={this.props.role}
                setCount={this.setMessagesUnreadCount}
                navigation={this.props.navigation} />);
            default:
              return(<MessagesListScreen
                role={this.props.role}
                setCount={this.setMessagesUnreadCount}
                navigation={this.props.navigation} />);
          }
        }}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        onRequestChangeTab={this._handleIndexChange}>
      </TabViewAnimated>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#0ca6c1',
  },
  labelstyle: {
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize: 18,
    marginBottom:3,
  },
  tabStyle: {
  },
  styletab: {
    backgroundColor:'#0ca6c1',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {
        paddingTop: 18,
        paddingBottom: 3,
      },
    }),
  },
  badgeview:{
    backgroundColor:'white',
    borderRadius:50,
    height:14,
    width:14,
    alignItems:'center',
    justifyContent:'center',
    marginTop:24,
    marginRight:Dimensions.get('screen').width/4 + 50,
  },
  textbadge:{
    color:'#0ca6c1',
    fontSize:12,
    fontFamily:'IRANSansMobileFaNum-Medium',
  },
});

export default InboxScreen;
