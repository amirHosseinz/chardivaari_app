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
import { NavigationActions } from 'react-navigation';
import timer from 'react-native-timer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';


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
      room: null,
    };
  }

  componentWillMount() {
    this.setState({
      party: this.props.navigation.state.params.party,
      username: this.props.navigation.state.params.username,
      lastMessageId: this.props.navigation.state.params.messageId,
      room: this.props.navigation.state.params.room,
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

  onBackButtonPress () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
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
        room_id: this.state.room.id,
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
    if (message.sender.username === this.state.party.username) {
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
    if (this.state.lastMessageId != null) {
      this.replyMessage(messages[0]);
    } else {
      this.composeMessage(messages[0]);
    }
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
        room_id: this.state.room.id,
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

  composeMessage (message) {
    fetch(productionURL + '/api/message/compose/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        body: message.text,
        recipient: this.state.party.username,
        sender: this.state.username,
        room_id: this.state.room.id,
        subject: this.state.room.title,
      }),
    })
    .then((response) => this.onComposeMessageResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجددا تلاش کنید.');
    });
  }

  onComposeMessageResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        lastMessageId: body.message_id,
      }, () => {
        this.fetchConversation();
      });
    } else {
      // TODO
      // an error handler
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.header0}>
          <View style={styles.header1}>
            <View style={styles.backbottomlastname}>
              <TouchableOpacity onPress={() => {
                this.onBackButtonPress();
              }}>
                <Icon size={28} color="#ffffff" name="arrow-forward" style={{marginTop:5,marginLeft:5,}} />
              </TouchableOpacity>
              <Text style={styles.headerlastname}>{this.state.party.last_name}</Text>
            </View>
            <View style={styles.showhome}>
              <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('houseDetail', {room: this.state.room});
              }}
              style={{flexDirection:'row-reverse'}}>
              <Icon
                name='home'
                size={18}
                color='#ffffff'
                style={{marginTop:3}}
              />
              <Text style={styles.showhouse}>مشاهده‌ی خانه</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  text: {
    fontSize: 24,
    color: 'black',
    fontFamily:'Vazir-Medium',
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
  showhouse:{
    fontSize:14,
    fontFamily:'Vazir-Light',
    color:'#ffffff',
    marginRight:5,
  },
  header0:{
    backgroundColor:'#0ca6c1',
    elevation:3,
    height:56,
    alignItems:'center',
  },
  header1:{
    flex:1,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    width:Dimensions.get('screen').width-36,
  },
  headerlastname:{
    fontSize:18,
    color:'#ffffff',
    fontFamily:'Vazir-Medium',
  },
  backbottomlastname:{
    flexDirection:'row-reverse',
  },
  showhome:{
    flexDirection:'row-reverse',
  },
});
export default ConversationScreen;
