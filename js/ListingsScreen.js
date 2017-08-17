import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ListingsListHeader from './ListingsListHeader';
import ListingRow from './ListingRow';

class ListingsScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      listings: [],
    };
  }

  componentWillMount() {
    // TODO
    // set listings list in state
    listings = [
      {
        id: 1,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 2,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 3,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 4,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 5,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 6,
        listingTitle: '',
        listingImageUri: '',
      },
      {
        id: 7,
        listingTitle: '',
        listingImageUri: '',
      },
    ];
  }

  _keyExtractor = (item, index) => item.id;

  renderListing({item}, navigation) {
    return(
      <ListingRow
        listingItem={item}
        navigation={navigation}
        role={this.props.role}
      />
    );
  }

  render() {
    return(
      <View style={styles.container}>

      <ListingsListHeader />

      <FlatList
        data={this.state.listings}
        keyExtractor={this._keyExtractor}
        renderItem={(item) => this.renderListing(item, this.props.navigation)}
      />

      <View style={styles.addingListing} >
        <Text style={styles.text} >افزودن خانه</Text>
        <Icon size={40} color="black" name="add" style={styles.addListingIconStyle} />
      </View>

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
  addingListing: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'gray',
    borderWidth: 3,
    borderRadius: 40,
    borderColor: 'green',
    width: Dimensions.get('screen').width - 20,
  },
  text: {
    fontSize: 25,
    color: 'black',
    paddingRight: 5,
  },
  addListingIconStyle: {
    paddingLeft: 5,
  },
});

export default ListingsScreen;
