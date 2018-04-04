import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
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

  renderPriceNumber (input) {
    var input = parseInt(input);
    input = Math.ceil(input / 1000);
    input = input * 1000;
    input = String(input);
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + ',' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + ',' + res;
    return(res);
  }

  renderPrice () {
    if (this.state.room.is_price_per_person) {
      if (this.state.room.avg_price != null) {
        return(
          <View style={styles.tripcardtexts2}>
            <Text style={styles.night1}>
              {this.renderPriceNumber(this.state.room.avg_price)}
            </Text>
            <Text style={styles.night}>تومان</Text>
            <Text style={styles.night}>/ هر شب هر نفر</Text>
          </View>
        );
      } else {
        return(
          <View style={styles.tripcardtexts2}>
            <Text style={styles.night1}>
              {this.renderPriceNumber(this.state.room.price)}
            </Text>
            <Text style={styles.night}>تومان</Text>
            <Text style={styles.night}>/ هر شب هر نفر</Text>
          </View>
        );
      }
    } else {
      if (this.state.room.avg_price != null) {
        return(
          <View style={styles.tripcardtexts2}>
            <Text style={styles.night1}>
              {this.renderPriceNumber(this.state.room.avg_price)}
            </Text>
            <Text style={styles.night}>تومان</Text>
            <Text style={styles.night}>/ هر شب در بازه‌ی انتخابی</Text>
          </View>
        );
      } else {
        return(
          <View style={styles.tripcardtexts2}>
            <Text style={styles.night1}>
              {this.renderPriceNumber(this.state.room.price)}
            </Text>
            <Text style={styles.night}>تومان</Text>
            <Text style={styles.night}>/ هر شب عادی</Text>
          </View>
        );
      }
    }
  }

  render () {
    return(
      <TouchableOpacity onPress={() => {
        this._onPress();
      }}>
      <View style={styles.container}>

        <View style={styles.tripcard1}>

          <View style={styles.tripcardtexts1}>
              <Text style={styles.cardtext1}>
                {this.state.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {this.state.room.address}
              </Text>
          </View>

          {this.renderPrice()}

        </View>

        <View style={styles.tripcard2}>
          <Image
            source={{ uri: productionURL + this.state.room.preview_low }}
            style={styles.image}>
            <Image style={{ width: 20, height: 20, alignSelf: 'flex-end' }}
            source={require('./img/like.png')} />
          </Image>
        </View>

      </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginTop: 5,
    borderRadius: 1,
  },
  tripcard1: {
    flex: 1.5,
    height: 110,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  tripcard2: {
    flex: 1,
    height: 110,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  tripcardtexts1: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 15,
  },
  tripcardtexts2: {
    flexDirection: 'row-reverse',
    marginBottom: 5,
  },
  image: {
    width: Dimensions.get('screen').width / 3,
    height: 110,
  },
  night: {
    fontSize: 13,
    fontFamily: "IRANSansMobileFaNum",
    color: "#acacac",
    marginRight: 3,
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  night1: {
    fontSize: 13,
    fontFamily: "IRANSansMobileFaNum",
    color: "#acacac",
    marginRight: 15,
    textAlign: 'right',
    alignSelf: 'stretch',
  },
});

export default BookmarkRowScreen;
