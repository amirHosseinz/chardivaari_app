import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

class TripsRow extends Component {

  onPress () {
    this.props.navigation.navigate(
      'tripDetailScreen',
      {
        trip: this.props.tripItem,
      }
    );
  }

  render () {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.tripItem.guest_person}
        </Text>
        <Text style={styles.text}>{this.props.tripItem.room.title}</Text>
        <Text style={styles.text}>{this.props.tripItem.start_date}</Text>
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

export default TripsRow;
