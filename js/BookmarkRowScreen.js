import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
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
    if (this.state.room.type=='room') {
      this.props.navigation.navigate('houseDetail', {
        room: this.state.room,
        refreshScreen: this.props.refreshScreen,
      });
    } else {
      this.props.navigation.navigate('ecotourismDetail', {
        room: this.state.room,
        refreshScreen: this.props.refreshScreen,
      });
    }
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
          <View style={styles.tripcardtexts3}>
            <View style={styles.tripcardtexts2}>
              <Text style={styles.night1}>
                {this.renderPriceNumber(this.state.room.avg_price)}
              </Text>
              <Text style={styles.night2}>تومان</Text>
              <Text style={styles.night3}>/ هر شب هر نفر</Text>
            </View>
          </View>
        );
      } else {
        return(
          <View style={styles.tripcardtexts3}>
            <View style={styles.tripcardtexts2}>
              <Text style={styles.night1}>
                {this.renderPriceNumber(this.state.room.price)}
              </Text>
              <Text style={styles.night2}>تومان</Text>
              <Text style={styles.night3}>/ هر شب هر نفر</Text>
            </View>
          </View>
        );
      }
    } else {
      if (this.state.room.avg_price != null) {
        return(
          <View style={styles.tripcardtexts3}>
            <View style={styles.tripcardtexts2}>
              <Text style={styles.night1}>
                {this.renderPriceNumber(this.state.room.avg_price)}
              </Text>
              <Text style={styles.night2}>تومان</Text>
              <Text style={styles.night3}>/ هر شب در بازه‌ی انتخابی</Text>
            </View>
          </View>
        );
      } else {
        return(
          <View style={styles.tripcardtexts3}>
            <View style={styles.tripcardtexts2}>
              <Text style={styles.night1}>
                {this.renderPriceNumber(this.state.room.price)}
              </Text>
              <Text style={styles.night2}>تومان</Text>
              <Text style={styles.night3}>/ هر شب عادی</Text>
            </View>
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
              <Text style={styles.cardtext1} numberOfLines={1}>
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
            <Icon size={30} color="#ea4f50" name="favorite" style={{
              position: 'absolute',
              zIndex: 200,
              backgroundColor: 'transparent',
            }} />
          </Image>
        </View>

      </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 1,
    ...Platform.select({
      ios: {
        flex: 1,
        marginTop: 4,
      },
      android: {
        marginTop: 5,
      },
    }),
  },
  tripcard1: {
    flex: 1.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    ...Platform.select({
      ios: {
        height: 108,
      },
      android: {
        height: 110,
      },
    }),
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
    // alignSelf: 'stretch',
    color: '#3e3e3e',
    fontFamily: 'IRANSansMobileFaNum-Medium',
    fontSize: 16,
  },
  cardtext2: {
    textAlign: 'right',
    // alignSelf: 'stretch',
    color: '#4f4f4f',
    fontFamily: 'IRANSansMobileFaNum',
    fontSize: 11,
  },
  tripcardtexts1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    ...Platform.select({
      ios: {
        marginRight: 10,
      },
      android: {
        marginRight: 15,
      },
    }),
  },
  tripcardtexts2: {
    flexDirection: 'row-reverse',
    marginBottom: 5,
  },
  tripcardtexts3: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  image: {
    // width: Dimensions.get('screen').width / 3,
    width:120,
    ...Platform.select({
      ios: {
        height: 108,
      },
      android: {
        height: 110,
      },
    }),
  },
  night1: {
    fontSize: 13,
    fontFamily: "IRANSansMobileFaNum",
    color: "#f56e4e",
    textAlign: 'right',
    // alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        marginRight: 10,
      },
      android: {
        marginRight: 15,
      },
    }),
  },
  night2: {
    fontSize: 13,
    fontFamily: "IRANSansMobileFaNum",
    color: "#f56e4e",
    textAlign: 'right',
    // alignSelf: 'stretch',
    marginRight: 3,
  },
  night3: {
    fontSize: 13,
    fontFamily: "IRANSansMobileFaNum",
    color: "#acacac",
    textAlign: 'right',
    // alignSelf: 'stretch',
    marginRight: 3,
  },
  imageOverlay: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
});

export default BookmarkRowScreen;
