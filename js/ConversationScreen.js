import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { GiftedChat } from 'react-native-gifted-chat';
import timer from 'react-native-timer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';

class ConversationScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      token: '',
      party: null,
      username: null,
      messages: [],
      lastMessageId: null,
      subject: null,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: <Text style={styles.headerTextStyle}>
        مکالمه با آقای/خانم   {navigation.state.params.party.last_name}
      </Text>,
    headerTintColor: "#000000",
    headerStyle: {
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      height: 70,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    },
    headerRight: navigation.state.params.room ? <TouchableOpacity
    onPress={() => {
      // navigation.navigate('roomView', {room: navigation.state.params.room});
      navigation.navigate('houseDetail', {room: navigation.state.params.room});
    }}
    style={{marginRight: 20}}>
    <Text>مشاهده‌ی خانه</Text>
    </TouchableOpacity> : null,
  });

  componentWillMount() {
    this.setState({
      party: this.props.navigation.state.params.party,
      username: this.props.navigation.state.params.username,
      lastMessageId: this.props.navigation.state.params.messageId,
    }, () => this.afterInitial());
    // this.setState({ partyImageUrl: 'https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg' });

    if (this.props.navigation.state.params.message != null) {
      this.onSend(this.props.navigation.state.params.message);
    }
  }

  autoRefreshTrigger () {
    timer.setTimeout(
      this,
      'refreshConversation',
      () => {
        this.fetchConversation();
      },
      10000,
    );
  }

  autoRefreshUnTrigger () {
    timer.clearInterval(this);
    timer.clearTimeout(this);
  }

  componentWillUnmount() {
    this.autoRefreshUnTrigger();
  }

  afterInitial () {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken (token) {
    this.setState({
      token
    }, () => this.fetchConversation());
  }

  fetchConversation () {
    fetch(productionURL + '/api/message/conversation/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        message_id: this.state.lastMessageId,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    this.autoRefreshUnTrigger();
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (this.state.subject == null) {
        this.setState({ subject: body.message_thread[0].subject });
      }
      this.updateFeed(body.message_thread);
      this.autoRefreshTrigger();
    } else {
      // TODO
      // an error handler
    }
  }

  updateFeed (messages = []) {
    lastFeededMessage = null;
    unFeededMessages = [];

    if (this.state.messages.length > 0) {
      this.setState({ lastMessageId: messages[0].id });
      lastFeededMessage = this.state.messages[this.state.messages.length - 1];
      for (i = 0; i < messages.length; i++) {
        if (messages[i].id === lastFeededMessage.id) {
          break;
        }
        unFeededMessages.push(messages[i]);
      }
    } else {
      unFeededMessages = messages;
    }

    showing_messages = [];
    for (i = 0; i < unFeededMessages.length; i++) {
      showing_messages.push(this.serverToChatMessage(unFeededMessages[i]));
    }
    this.setState({ messages: showing_messages });
  }

  serverToChatMessage (message) {
    userId = 1;
    if (message.sender === this.state.party.username) {
      userId = 2;
    }
    showable_message = {
      _id: message.id,
      text: message.body,
      createdAt: message.sent_at,
      user: {
        _id: userId,
      },
    };
    return showable_message;
  }

  onSend (messages = []) {
    this.replyMessage(messages[0]);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  replyMessage (message) {
    fetch(productionURL + '/api/message/reply/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        message_id: this.state.lastMessageId,
        body: message.text,
        recipient: this.state.party.username,
        subject: this.state.subject,
        sender: this.state.username,
      }),
    })
    .then((response) => this.onReplyMessageResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجددا تلاش کنید.');
    });
  }

  onReplyMessageResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.updateFeed(body.message_thread);
    } else {
      // TODO
      // an error handler
    }
  }

  renderProfilePicture () {
    if (this.state.party.profile_picture != null) {
      return(
        <Image style={styles.profileImageStyle} source={{
          uri: productionURL+this.state.party.profile_picture,
        }} />
      );
    } else {
      return(
        <Icon
          name='account-circle'
          size={50}
          color='#c2c2c2'
          style={styles.profileImageStyle}
        />
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.conversationHeader}>
          <Text style={styles.text} >{this.state.party.last_name}</Text>
          {this.renderProfilePicture()}
        </View>

        <GiftedChat
          placeholder={'پیامتان را تایپ کنید...'}
          label={'ارسال'}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationHeader: {
    width: Dimensions.get('screen').width,
    height: 70,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdf5e6',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 20 },
    shadowOpacity: 1,
    elevation: 2,
    position: 'relative'
  },
  text: {
    fontSize: 30,
    color: 'black',
  },
  profileImageStyle: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  headerTextStyle: {
    fontFamily: "Vazir-Light",
    fontSize:14,
  },
});

export default ConversationScreen;
