import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

class ListingRow extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return(
      <View style={styles.container} >
        <Text>{this.props.listingItem.listingTitle}</Text>
        <Image
          source={this.props.listingItem.listingImageUri}
          style={styles.image}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: 50,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default ListingRow;
