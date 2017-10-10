import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
  FlatList,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import timer from 'react-native-timer';

// import InboxRow from './InboxRow';
// import InboxHeader from './InboxHeader';
import PrivateMessageRow from './PrivateMessageRow';
import { testURL, productionURL } from './data';

class MessagesListScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      messages: [],
      unreadCount: 0,
      token: '',
      refreshing: true,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
    timer.setInterval(
      this,
      'refreshMsgList',
      () => {
        this.setState({
          refreshing: true,
        });
      },
      11000,
    );
  }

  componentWillUnmount() {
      timer.clearInterval(this);
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchMessageList());
  }

  fetchMessageList () {
    fetch(productionURL + '/api/message/list/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      Alert.alert('خطای اتصال به اینترنت!');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        messages: body.message_list,
        unreadCount: body.count,
        refreshing: false,
      });
      this.props.setCount(body.count);
    } else {
      // TODO
      // an eror handler
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderMessage({item}, navigation) {
    return(
      <PrivateMessageRow
        message={item}
        navigation={navigation}
      />
    );
  }

  _onRefresh () {
    if (this.state.refreshing) {
      this.fetchMessageList();
    }
  }

  refresh = () => {
    this.setState({
      refreshing: true,
    });
  }

  render() {
    return(
      <View style={styles.container}>
        {this._onRefresh()}
        <FlatList
          data={this.state.messages}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderMessage(item, this.props.navigation)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    marginBottom: 65,
    backgroundColor: '#F5FCFF',
  },
});

export default MessagesListScreen;
