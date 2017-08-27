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

import InboxRow from './InboxRow';
import InboxHeader from './InboxHeader';
import { testURL, productionURL } from './data';

class MessagesListScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      messages: [],
      unreadCount: 0,
      token: '',
    };
  }

  componentWillMount() {
    // this method run before loading page
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchMessageList());
  }

  fetchMessageList() {
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
      console.error(error);
    });
  }

  componentDidMount() {
    // this method run after loading page
  }

  onResponseRecieved(response) {
    console.log('response: ');
    console.log(response);
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        messages: body.message_list,
        unreadCount: body.count,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  onUnreadMessagePress() {
    // TODO
    // dis count unread count
    Alert.alert('you read message.');
  }

  _keyExtractor = (item, index) => item.id;

  renderMessage({item}, navigation) {
    return(
      <InboxRow
        message={item}
        navigation={navigation}
      />
    );
  }

  render() {
    return(
      <View style={styles.container} >
        <InboxHeader count={this.state.unreadCount} />
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
    marginTop: 10,
    marginBottom: 70,
    backgroundColor: '#F5FCFF',
  },
});

export default MessagesListScreen;
