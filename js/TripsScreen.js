import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

class TripsScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
    };
  }

  componentWillMount () {
    // TODO
    // set token from CacheStore
  }

  fetchTripList () {
    // TODO
    // fetch trip list from server
  }

  render() {
    return(
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 25,
  },
});

export default TripsScreen;
