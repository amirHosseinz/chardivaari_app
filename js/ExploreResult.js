import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';

class ExploreResult extends Component {

  renderPrice (input) {
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + ',' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + ',' + res;
    return(res);
  }

  render () {

    var rating = this.props.room.rating;
    if (rating - Math.floor(rating) < 0.5) {
      rating = Math.floor(rating);
    } else {
      rating = Math.ceil(rating);
    }

    return(
      <TouchableOpacity onPress={() => {
        // this.props.navigation.navigate('roomView', {room: this.props.room});
        this.props.navigation.navigate('houseDetail', {
          room: this.props.room,
        });
      }}>
    <View style={styles.cards}>
        <View style={styles.previewimg}>
          <Image
          source={{ uri: productionURL + this.props.room.preview }}
          style={styles.image}>
          </Image>
        </View>
        <View style={styles.details}>
            <View style={styles.info}>
              <Text style={styles.h2} numberOfLines={1} >{this.props.room.title}</Text>
              <Text style={styles.cityfont}>
                {this.props.room.address}
              </Text>

              <View style={styles.stars}>
                <Stars
                  value={5-rating}
                  spacing={0}
                  count={5}
                  starSize={15}
                  backingColor={'#f9f9f9'}
                  fullStar= {require('./img/starBlank.png')}
                  emptyStar= {require('./img/starFilled.png')}/>
              </View>
            </View>

            <View style={styles.price}>
              <Text style={styles.pricetext}>
                {this.renderPrice(String(this.props.room.price))}
              </Text>
              <Text style={styles.toman}>تومان</Text>
              <Text style={styles.night}>/ هر شب</Text>
            </View>
        </View>
    </View>
    </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cards: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 0,
    height: 110,
    marginTop:5,
    borderRadius: 1,
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems: 'center',
  },
  previewimg: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width/3,
    height: 110,
  },
  details: {
    flex: 4,
    flexDirection: "column",
    justifyContent: 'flex-end',
    alignItems:"flex-end",
    marginRight:10,
    paddingRight:20,
    backgroundColor:'#f9f9f9',
  },
  info: {
    flex:3,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop:8,
  },
  h2: {
    fontSize: 16,
    fontFamily: "Vazir-Medium",
    color: "#4f4f4f",
    paddingLeft:10,
  },
  cityfont:{
    fontSize: 11,
    fontFamily: "Vazir",
    color: "#4f4f4f",
  },
  stars: {
    alignItems: "flex-end",
  },
  price: {
    flex:1,
    justifyContent:"flex-start",
    flexDirection: "row-reverse",
  },
  pricetext: {
    fontSize: 13,
    fontFamily: "Vazir",
    color: "#f56e4e"
  },
  toman: {
    fontSize: 13,
    fontFamily: "Vazir",
    color: "#f56e4e",
    marginRight:2,
  },
  night: {
    fontSize: 13,
    fontFamily: "Vazir",
    color: "#acacac",
    marginRight:2,
  },
});

export default ExploreResult;
