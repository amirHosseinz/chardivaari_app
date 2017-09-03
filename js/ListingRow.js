import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { testURL, productionURL } from './data';

class ListingRow extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  componentWillMount () {
    // run before loading this component
  }

  onPress() {
    this.props.navigation.navigate(
      'editListingScreen',
      {
        listing: this.props.listingItem,
      }
    );
  }

  render() {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)}>
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.listingItem.title}</Text>
        <Image
          source={{ uri: productionURL + this.props.listingItem.preview }}
          style={styles.image} />
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
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default ListingRow;
