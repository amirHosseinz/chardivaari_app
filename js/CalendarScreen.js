import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

class CalendarScreen extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={{marginTop: 20}}>
          <Text style={styles.helloText}>Calendar Screen, to be coninued!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  helloText: {
    fontSize: 25,
  },
});

export default CalendarScreen;
