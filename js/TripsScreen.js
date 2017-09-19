import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import CacheStore from 'react-native-cache-store';

import TripsRow from './TripsRow';
import TripsHeaderScreen from './TripsHeaderScreen';
import { testURL, productionURL } from './data';

class TripsScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      count: 0,
      tripList: [],
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchTripList ());
  }

  fetchTripList () {
    fetch(productionURL + '/api/reservations/list/', {
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
      // network error
      // console.error(error);
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        count: body.count,
        tripList: body.reserve_list,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderTripItem ({item}, navigation) {
    return(
      <TripsRow
        tripItem={item}
        navigation={navigation}
      />
    );
  }

  render () {
    return(
      <View style={styles.container}>
        <TripsHeaderScreen count={this.state.count}/>
        <FlatList
          data={this.state.tripList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderTripItem(item, this.props.navigation)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 60 + 10,
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 25,
  },
});

export default TripsScreen;
