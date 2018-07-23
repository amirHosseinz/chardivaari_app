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
import Spinner from 'react-native-spinkit';
import RequestRowScreen from './RequestRowScreen';
import { productionURL } from './data';


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
    if (this.props.role === 'host') {
      CacheStore.get('host_requestsList').then((value) => {this.setRequests(value);});
    } else if (this.props.role === 'guest') {
      CacheStore.get('guest_requestsList').then((value) => {this.setRequests(value);});
    }
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
    fetch(productionURL + '/api/v1/request/list/', {
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
      this.setState({
        'refreshing':false
      });
      CacheStore.get('errorAlert').then((value) => {
        if (value && value=='off') {
          Alert.alert(
            'خطای شبکه',
            'لطفا از اتصال اینترنت مطمئن شوید.',
            [
              {text: 'OK', onPress: () => {
                CacheStore.set('errorAlert', 'off');
              }},
            ],
            { cancelable: false }
          );
          CacheStore.set('errorAlert', 'on');
        } else if (value && value=='on') {
          // do nothing
        } else {
          Alert.alert(
            'خطای شبکه',
            'لطفا از اتصال اینترنت مطمئن شوید.',
            [
              {text: 'OK', onPress: () => {
                CacheStore.set('errorAlert', 'off');
              }},
            ],
            { cancelable: false }
          );
          CacheStore.set('errorAlert', 'on');
        }
      });
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
      if (this.props.role === 'host') {
        CacheStore.set('host_requestsList', body.request_list);
      } else if (this.props.role === 'guest') {
        CacheStore.set('guest_requestsList', body.request_list);
      }
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
          <Text style={styles.notlogintext}>
           شما وارد حساب کاربری خود نشده‌اید.
          </Text>
          <TouchableOpacity style={styles.logintouch} onPress={() => {
            timer.clearInterval(this);
            this.resetNavigation('login');
          }}>
            <Text style={styles.notlogintext1}> ورود </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderRequestList(){
    if (this.state.requests != null && (this.state.requests.length > 0)){
        return (
          <FlatList
          data={this.state.requests}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderRequest(item, this.props.navigation)} />
        );
    }else{
      if (this.state.refreshing){
        return (
          <View style={styles.container0}>
          <View style={styles.notlogin}>
            <Spinner
              type={styles.spinner}
              isVisible={this.state.refreshing}
              size={70}
              type={'ThreeBounce'}
              color={'#0ccbed'} />
              <Text style={styles.notlogintext}> در حال دریافت لیست درخواست </Text>
          </View>
          </View>
        );
      }else{
        return (
          <View style={styles.container0}>
          <View style={styles.notlogin}>
            <Text style={styles.notlogintext}> شما درخواست ثبت شده‌ای ندارید. </Text>
          </View>
          </View>
        );
      }
    }
  }

  render(){
    return(
      <View style={styles.container}>
        {this._onRefresh()}
        {this.renderLoginButton()}
        {this.renderRequestList()}
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
    marginBottom: 0,
    backgroundColor: '#ededed',
  },
  spinner: {
    marginTop: 10,
  },
  notlogin:{
    alignItems:'center',
    marginTop:50,
    width: Dimensions.get('window').width - 20,
  },
  notlogintext:{
    color:'#616161',
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:18,
    textAlign:'center',
    marginTop:0,
    marginBottom:0,
  },
  notlogintext1:{
    color:'#f56e4e',
    fontFamily:'IRANSansMobileFaNum-Medium',
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
