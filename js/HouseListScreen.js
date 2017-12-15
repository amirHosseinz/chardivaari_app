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
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { productionURL, GATrackerId } from './data';


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
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('HouseListScreen');
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
          <Text style={styles.headertext}> خانه ثبت شده دارید. </Text>
        </View>
      );
    } else {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}> خانه ثبت شده‌ای ندارید. </Text>
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
    this.props.navigation.navigate('houseDetail', {
      room: item,
      role: 'host',
    });
  }

  renderListing({item}, navigation) {
    return(
      <TouchableOpacity onPress={() => {
        this._onListingPress(item);
      }}>
      <View style={{width: Dimensions.get('window').width,alignItems:'center'}}>
        <View style={styles.cards}>
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
            <Image source={{ uri: productionURL + item.preview }}
              style={styles.image} />
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
           contentContainerStyle={{paddingBottom:8}}
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
  },
  headerbar:{
    flexDirection:'row-reverse',
    height:56,
    width:Dimensions.get('window').width,
    backgroundColor:"#0ca6c1",
    alignItems:'center',
    justifyContent:'center',
    marginBottom:4,
    elevation:3,
  },
  headertext:{
    color:'#ffffff',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
  },
  card1:{
    flex:1,
    flexDirection:"row-reverse",
  },
  housedetail:{
    flexDirection:'row-reverse',
  },
  textbox:{
  },
  houseimagebox:{
  },
  imagestyle:{
  },
  housetitle:{
    fontSize:16,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color:"#3e3e3e"
  },
  cards: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 10,
    height: 80,
    marginTop:5,
    borderRadius: 3,
    flexDirection: "row-reverse",
    alignItems: 'center',
  },
  previewimg : {
    alignItems: 'center',
  },
  image : {
    height: 80,
    width: 80,
    resizeMode:'cover',
  },
  details: {
    backgroundColor: '#f9f9f9',
    flex:1,
    height:80,
    width: Dimensions.get('window').width - 70,
    paddingRight:10,
  },
  detailtexts:{
    fontSize:12,
    fontFamily:"IRANSansMobileFaNum-Light",
    color:"#3e3e3e",
    marginLeft:5,
  },
  container1:{
    paddingBottom:61,
    alignItems:'center',
  },
});

export default HouseListScreen;
