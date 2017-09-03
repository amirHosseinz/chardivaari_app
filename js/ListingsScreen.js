import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CacheStore from 'react-native-cache-store';

import ListingsListHeader from './ListingsListHeader';
import ListingRow from './ListingRow';
import { testURL, productionURL } from './data';

class ListingsScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      listings: [],
      token: '',
      username: null,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchListingList());
  }

  fetchListingList () {
    fetch(productionURL + '/api/room/list/', {
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

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        listings: body.listings,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderListing({item}, navigation) {
    return(
      <ListingRow
        listingItem={item}
        navigation={navigation}
      />
    );
  }

  render() {
    return(
      <View style={styles.container}>

      <ListingsListHeader />

      <FlatList
        data={this.state.listings}
        keyExtractor={this._keyExtractor}
        renderItem={(item) => this.renderListing(item, this.props.navigation)} />

      <View style={styles.addingListing} >
        <Text style={styles.text} >افزودن خانه</Text>
        <Icon size={40} color="black" name="add" />
      </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 20,
    marginBottom: 60 + 10,
    backgroundColor: '#F5FCFF',
  },
  addingListing: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderWidth: 3,
    borderRadius: 40,
    borderColor: 'green',
    width: Dimensions.get('screen').width,
  },
  text: {
    fontSize: 25,
    color: 'black',
  },
});

export default ListingsScreen;
