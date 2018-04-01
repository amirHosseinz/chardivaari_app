import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';


class BookmarkRowScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      room: {},
    };
  }

  componentWillMount () {
    if (this.props.bookmarkItem.room) {
      this.setState({
        room: this.props.bookmarkItem.room,
      });
    } else if (this.props.bookmarkItem.eco_room) {
      this.setState({
        room: this.props.bookmarkItem.eco_room,
      });
    }
  }

  _onPress () {
    // TODO
  }

  render () {
    return(
      <TouchableOpacity onPress={() => {
        this._onPress();
      }}>
        <View style={styles.tripcard}>
          <View style={styles.tripcardtexts}>
          <View style={styles.rightAlignBox}>
            <Text style={styles.cardtext1}>
              {this.state.room.title}
            </Text>
            </View>
            <View style={styles.rightAlignBox}>
            <Text style={styles.cardtext2}>
              {this.state.room.address}
            </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tripcard: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 10,
    height: 65,
    backgroundColor: '#f9f9f9',
    marginTop: 5,
    borderRadius: 1,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  rightAlignBox: {
    flexDirection: 'row-reverse',
  },
  cardtext1: {
    textAlign: 'right',
    alignSelf: 'stretch',
    color: '#3e3e3e',
    fontFamily: 'IRANSansMobileFaNum-Medium',
    fontSize: 16,
  },
  cardtext2: {
    textAlign: 'right',
    alignSelf: 'stretch',
    color: '#3e3e3e',
    fontFamily: 'IRANSansMobileFaNum-Light',
    fontSize: 12,
  },
  tripcardtexts: {
    flex: 5,
    marginRight: 5,
  },
});

export default BookmarkRowScreen;
