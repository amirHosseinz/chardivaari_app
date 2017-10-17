import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';


class Trips extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      count: 0,
      tripList: [],
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchTripList ());
  }

  fetchTripList () {
    fetch(productionURL + '/api/reservations/list/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        role: this.props.role,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نماییدد.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        count: body.count,
        tripList: body.reserve_list,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  _onTripPress (trip) {
    this.props.navigation.navigate(
      'tripStatusScreen',
      {
        trip: trip,
        role: this.props.role,
        refresh: this.refreshScreen,
      }
    );
  }

  _keyExtractor = (item, index) => item.id;

  renderTripItem ({item}, navigation) {

    switch(item.status) {
    case 'IN_PROGRESS':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
            <View style={styles.tripcardtexts}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#00cecc" name="hourglass-empty" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'DONE':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
            <View style={styles.tripcardtexts}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#00cecc" name="check-circle" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'ISSUED':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
            <View style={styles.tripcardtexts}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#f56e4e" name="report-problem" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'CANCELED_BY_HOST':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
            <View style={styles.tripcardtexts}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#f56e4e" name="cancel" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'CANCELED_BY_GUEST':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
            <View style={styles.tripcardtexts}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#f56e4e" name="cancel" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    default:
    }

  }

  renderHeader () {
    if (this.state.count > 0) {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}>{this.state.count}</Text>
          <Text style={styles.headertext}> سفر تایید شده دارید! </Text>
        </View>
      );
    } else {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}>سفر تایید شده‌ای ندارید.</Text>
        </View>
      );
    }
  }

  render () {
    return(
      <View style={styles.container0}>
        {this.renderHeader()}
        <View style={styles.container1}>

        <FlatList
          data={this.state.tripList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderTripItem(item, this.props.navigation)}/>

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
  tripcard: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 20,
    height: 65,
    backgroundColor: '#f9f9f9',
    marginTop:5,
    borderRadius: 3,
    flexDirection: "row-reverse",
    justifyContent:"flex-start",
    alignItems: 'center',
},
  cardtext1:{
    color:'#3e3e3e',
    fontFamily:'Vazir-Medium',
    fontSize:16,
  },
  cardtext2:{
    color:'#3e3e3e',
    fontFamily:'Vazir-Light',
    fontSize:12,
  },
  iconbox:{
    flex:1,
    marginLeft:12,
  },
  tripcardtexts:{
    flex:5,
    marginRight:12,
  }
});

export default Trips;
