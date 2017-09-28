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

import RequestsListHeader from './RequestsListHeader';
import RequestRow from './RequestRow';

import { testURL, productionURL } from './data';

class RequestsListScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      requests: [],
      token: '',
      toDoCount: 0,
    };
  }

  componentWillMount() {
    // this.setState({
    //   requests: initRequests,
    // });
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken (token) {
    this.setState({
      token
    }, () => this.fetchRequestList());
  }

  fetchRequestList () {
    console.log('role');
    console.log(this.props.role);
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
      console.error(error);
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        requests: body.request_list,
        toDoCount: body.count,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderRequest({item}, navigation) {
    return(
      <RequestRow
        requestItem={item}
        navigation={navigation}
        role={this.props.role}
      />
    );
  }

  render(){
    return(
      <View style={styles.container} >
        <RequestsListHeader count={this.state.toDoCount} />
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
