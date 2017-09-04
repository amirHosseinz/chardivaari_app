import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

class TripsHeaderScreen extends Component {

  render () {
    return(
      <View style={styles.container}>
        <Text style={styles.headerText}>شما {this.props.count} سفر تایید شده دارید</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: 50,
    padding: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f4f4f',
  },
  headerText: {
    color: 'white',
    fontSize: 23,
  },
});

export default TripsHeaderScreen;
