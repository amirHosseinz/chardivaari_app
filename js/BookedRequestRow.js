import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

class BookedRequestRow extends Component {

  componentWillMount () {
    // runs before Component
  }

  onPress () {
    // this.props.navigation.navigate(
    //   'editListingScreen',
    //   {
    //     listing: this.props.listingItem,
    //   }
    // );
    Alert.alert('pressed.');
  }

  render () {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)}>
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.requestItem.guest_person}</Text>
        <Text style={styles.text}>{this.props.requestItem.room}</Text>
        <Text style={styles.text}>{this.props.requestItem.start_date}</Text>
      </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#d3d3d3',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default BookedRequestRow;
