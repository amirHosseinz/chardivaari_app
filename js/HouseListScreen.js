import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';


class HouseListScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      listings: [],
      token: '',
      username: null,
      count: 0,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchListingList());
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  fetchListingList () {
    fetch(productionURL + '/api/room/list/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        listings: body.listings,
        count: body.count,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  _keyExtractor = (item, index) => item.id;

  renderHeader () {
    if (this.state.count > 0) {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}>{this.state.count}</Text>
          <Text style={styles.headertext}> خانه ثبت شده دارید </Text>
        </View>
      );
    } else {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}> خانه ثبت شده‌ای ندارید</Text>
        </View>
      );
    }
  }

  renderListingType (item) {
    result = '';
    switch(item.room_type) {
    case 'SUITE':
      result = 'سوییت ';
      break;
    case 'VILLA':
      result = 'ویلا ';
      break;
    case 'HOUSE':
      result = 'خانه ';
      break;
    case 'APT':
      result = 'آپارتمان ';
      break;
    default:
      result = 'سوییت ';
    }

    switch(item.service_type) {
    case 'ENTIRE_HOME':
      result = result + 'کامل';
      break;
    case 'PRIVATE_ROOM':
      result = result + 'خصوصی';
      break;
    case 'SHARED_ROOM':
      result = result + 'مشترک';
      break;
    default:
      result = result + 'کامل';
    }

    return(result);
  }

  _onListingPress (item) {
    this.props.navigation.navigate(
      'editHouse',
      {
        listing: item,
        refresh: this.refreshScreen,
      }
    );
  }

  renderListing({item}, navigation) {
    return(
      <TouchableOpacity onPress={() => {
        this._onListingPress(item);
      }}>
        <View style={styles.cards}>
          <View style={styles.previewimg}>
            <Image source={{ uri: productionURL + item.preview }}
              style={styles.image} />
          </View>
            <View style={styles.details}>
              <Text style={styles.housetitle}>{item.title}</Text>
              <View style={styles.housedetail}>
                <Text style={styles.detailtexts}>{this.renderListingType(item)}</Text>
                <Text style={styles.detailtexts}>{item.area}</Text>
                <Text style={styles.detailtexts}>متری</Text>
                <Text style={styles.detailtexts}>هر شب</Text>
                <Text style={styles.detailtexts}>{item.price}</Text>
                <Text style={styles.detailtexts}>تومان</Text>
              </View>
            </View>
          </View>
      </TouchableOpacity>
    );
  }

  render () {
    return(
      <View style={styles.container0}>
        {this.renderHeader()}
        <View style={styles.container1}>

          <FlatList
            data={this.state.listings}
            keyExtractor={this._keyExtractor}
            renderItem={(item) => this.renderListing(item, this.props.navigation)} />

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#e5e5e5',
  },
  headerbar:{
    flexDirection:'row-reverse',
    height:50,
    width:Dimensions.get('window').width,
    backgroundColor:"#636877",
    alignItems:'center',
    justifyContent:'center',
    marginBottom:4,
  },
  headertext:{
    color:'#e5e5e5',
    fontFamily:'Vazir-Medium',
    fontSize:16,
  },
  card1:{
    flex:1,
    flexDirection:"row-reverse",
  },
  housedetail:{
    flexDirection:'row-reverse',
  },
  textbox:{
    flex:4,
  },
  houseimagebox:{
    flex:2,
  },
  imagestyle:{
    flex:2,
    resizeMode:'contain',
  },
  housetitle:{
    fontSize:18,
    fontFamily:"Vazir-Medium",
    color:"#3e3e3e"
  },
  cards: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 20,
    height: 80,
    backgroundColor: '#f9f9f9',
    marginTop:5,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: 'center',
  },
  previewimg : {
    flex: 1,
    alignItems: 'center',
  },
  image : {
    height: 80,
    width: 80,
    resizeMode:'contain',
  },
  details: {
    flex: 4,
    marginRight:10,
  },
  detailtexts:{
    fontSize:14,
    fontFamily:"Vazir-Light",
    color:"#3e3e3e",
    marginLeft:5,
  }
});

export default HouseListScreen;
