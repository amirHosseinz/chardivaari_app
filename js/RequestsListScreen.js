import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
      toDoCount: 0,
      refreshing: true,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
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

  render(){
    return(
      <View style={styles.container}>
        {this._onRefresh()}
        <FlatList
          data={this.state.requests}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderRequest(item, this.props.navigation)} />
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

export default RequestsListScreen;
