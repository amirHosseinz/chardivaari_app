import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

class BookedListHeader extends Component {

  componentWillMount () {
    // run before Component
  }

  render () {
    return(
      <View style={styles.container}>
        <Text style={styles.headerText}>شما {this.props.count} رزرو تایید شده دارید</Text>
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

export default BookedListHeader;
