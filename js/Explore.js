import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import SearchAnimations from './SearchAnimations';
import CacheStore from 'react-native-cache-store';

import ExploreResult from './ExploreResult';
import { testURL, productionURL } from './data';

class Explore extends Component {
  state={
    error: null,
    token: null,
    numberOfGuests: null,
    from_date: null,
    untill_date: null,
    where: null,
    rooms: [],
  };

  componentWillMount() {
    CacheStore.get('token').then((value) => {
      this.setState({ token: value });
      this.onSearchButtonPress();
    });
  }

  onSearchButtonPress() {
    fetch(productionURL + '/api/search/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        district: this.state.where,
        start_date: (this.state.from_date == null) ? null : this.state.from_date.toISOString(),
        end_date: (this.state.untill_date == null) ? null : this.state.untill_date.toISOString(),
        capacity: this.state.numberOfGuests,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      this.setState({
        error: 'خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.'
      });
    });
  }

  onResponseRecieved(response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        error: null,
        rooms: body.room,
      });
    } else {
      this.setState({ error: 'خطایی رخ داده.' });
    }
  }

  renderResults () {
    return this.state.rooms.map(room =>
      <ExploreResult key={room.id} room={room} navigation={this.props.navigation} />
    );
  }

  renderError () {
    if (this.state.error != null) {
      return(
        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <SearchAnimations />
        <View style={styles.filter}>
        </View>

        {this.renderError()}

        <ScrollView style={{
          marginTop: 5,
          marginBottom: 70,
        }}
        showsHorizontalScrollIndicator={false}
        >

        {this.renderResults()}

        </ScrollView>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#dddddd',
  },
  filter : {
    backgroundColor: '#636877',
    height:15,
    width: Dimensions.get('screen').width,
  },
  errorTextStyle: {
    fontSize: 16,
    fontFamily: "Vazir",
    color: "red",
  },
});

export default Explore;
