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
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
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
      username: null,
      refreshing: true,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
    CacheStore.get('messagesList').then((value) => {this.setMessagesList(value);});
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

  setMessagesList (messagesList) {
    if (messagesList != null) {
      this.setState({
        messages: messagesList,
      });
    }
  }

  setUsername (username) {
    this.setState({
      username
    });
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
      CacheStore.set('messagesList', body.message_list);
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

  resetNavigation (targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  renderLoginButton = () => {
    if (this.state.username && this.state.username === 'GUEST_USER') {
      return(
        <View style={styles.notlogin}>
          <Text style={styles.notlogintext}> شما وارد حساب کاربری خود نشده اید.  </Text>
          <TouchableOpacity style={styles.logintouch} onPress={() => {
            this.resetNavigation('login');
          }}>
            <Text style={styles.notlogintext1}> ورود </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return(
      <View style={styles.container}>
      <StatusBar
        backgroundColor="#007c97"
        barStyle="light-content"
      />
        {this._onRefresh()}
        {this.renderLoginButton()}
        <FlatList
          data={this.state.messages}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderMessage(item, this.props.navigation)} />
        <View style={{marginBottom:10}}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    marginBottom: 58,
    backgroundColor: '#ededed',
  },
  notlogin:{
    alignItems:'center',
    marginTop:50,
    width: Dimensions.get('window').width - 20,
  },
  notlogintext:{
    color:'#616161',
    fontFamily:'Vazir-Light',
    fontSize:18,
    textAlign:'center',
    marginTop:0,
    marginBottom:0,
  },
  notlogintext1:{
    color:'#f56e4e',
    fontFamily:'Vazir-Medium',
    fontSize:18,
    textAlign:'center',
    marginTop:0,
    marginBottom:0,
  },
  logintouch:{
    flexDirection:'row-reverse',
    alignItems:'center',
  },
});

export default MessagesListScreen;
