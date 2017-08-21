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
import { messageListData, unreadMessagesCount } from './data';

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
    this.setState({
      unreadCount: unreadMessagesCount,
      messages: messageListData,
    });
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({ token });
  }

  componentDidMount() {
    // this method run after loading page
    // fetch('https://www.zorozadeh.com/api/search/', {
    fetch('http://192.168.12.100:8000/api/message/list/', {
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

  onResponseRecieved(response) {
    // TODO
    console.log('response: ');
    console.log(response);
    console.log('token: ');
    console.log(this.state.token);
  }

  onUnreadMessagePress() {
    // TODO
    // dis count unread count
    Alert.alert('you read message.');
  }

  _keyExtractor = (item, index) => item.message.id;

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
