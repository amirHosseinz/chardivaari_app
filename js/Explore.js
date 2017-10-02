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
    capacity: null,
    start_date: null,
    end_date: null,
    destination: null,
    rooms: [],
    locations: [],
  };

  componentWillMount() {
    CacheStore.get('token').then((value) => {
      this.setState({ token: value });
      this.fetchHomepage();
    });
  }

  fetchHomepage () {
    fetch(productionURL + '/api/homepage/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onFetchHomepageResponseRecieved(response))
    .catch((error) => {
      this.setState({
        error: 'خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.'
      });
    });
  }

  onFetchHomepageResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      lc = [];
      for (var i = 0; i < body.location.length; i++) {
        lc.push(body.location[i].text);
      }
      this.setState({
        error: null,
        rooms: body.room,
        locations: lc,
      });
    } else {
      this.setState({ error: 'خطایی رخ داده.' });
    }
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
        district: this.state.destination,
        start_date: (this.state.start_date == null) ? null : this.state.start_date.toISOString(),
        end_date: (this.state.end_date == null) ? null : this.state.end_date.toISOString(),
        capacity: this.state.capacity,
      }),
    })
    .then((response) => this.onSearchResponseRecieved(response))
    .catch((error) => {
      this.setState({
        error: 'خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.'
      });
    });
  }

  onSearchResponseRecieved (response) {
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

  setStartDate = (startDate) => {
    this.setState({
      start_date: startDate,
    });
  }

  setEndDate = (endDate) => {
    this.setState({
      end_date: endDate,
    });
  }

  setDestination = (destination) => {
    this.setState({ destination });
  }

  setCapacity = (capacity) => {
    this.setState({ capacity });
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
        <SearchAnimations
          locations={this.state.locations}
          setStartDate={this.setStartDate}
          setEndDate={this.setEndDate}
          setDestination={this.setDestination}
          setCapacity={this.setCapacity}
        />
        <View style={styles.filter}>
        </View>

        {this.renderError()}

        <ScrollView style={{
          marginTop: 5,
          marginBottom: 65,
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
    height:10,
    width: Dimensions.get('screen').width,
  },
  errorTextStyle: {
    fontSize: 16,
    fontFamily: "Vazir",
    color: "red",
  },
});

export default Explore;
