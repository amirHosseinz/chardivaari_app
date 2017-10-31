import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import CacheStore from 'react-native-cache-store';
import timer from 'react-native-timer';

// import RequestsListHeader from './RequestsListHeader';
// import RequestRow from './RequestRow';
import RequestRowScreen from './RequestRowScreen';
import { testURL, productionURL } from './data';


class RequestsListScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      requests: [],
      token: '',
      username: null,
      toDoCount: 0,
      refreshing: true,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
    CacheStore.get('requestsList').then((value) => {this.setRequests(value);});
    timer.setInterval(
      this,
      'refreshReqList',
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

  setRequests (requestsList) {
    if (requestsList != null) {
      this.setState({
        requests: requestsList,
      });
    }
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  setToken (token) {
    this.setState({
      token
    }, () => this.fetchRequestList());
  }

  fetchRequestList () {
    fetch(productionURL + '/api/request/list/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.props.role,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      Alert.alert('لطفا پس از اطمینان از اتصال اینترنت، مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        requests: body.request_list,
        toDoCount: body.count,
        refreshing: false,
      });
      CacheStore.set('requestsList', body.request_list);
      this.props.setCount(body.count);
    } else {
      // TODO
      // an eror handler
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderRequest({item}, navigation) {
    return(
      <RequestRowScreen
        requestItem={item}
        navigation={navigation}
        role={this.props.role}
        refresh={this.refresh}
      />
    );
  }

  _onRefresh () {
    if (this.state.refreshing) {
      this.fetchRequestList();
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

  render(){
    return(
      <View style={styles.container}>
        {this._onRefresh()}
        {this.renderLoginButton()}
        <FlatList
          data={this.state.requests}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderRequest(item, this.props.navigation)} />
          <View style={{marginBottom:35}}>
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

export default RequestsListScreen;
