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
import Moment from 'moment';
import moment from 'moment-jalaali';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { productionURL, GATrackerId } from './data';

class ReserveList extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      count: 0,
      reserveList: [],
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('ReserveList');
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('reservesList').then((value) => {this.setReservesList(value);});
  }

  setReservesList (reservesList) {
    if (reservesList != null) {
      this.setState({
        reserveList: reservesList,
        count: reservesList.length,
      });
    }
  }

  setToken = (token) => {
    this.setState({
      token
    }, () => this.fetchReserveList());
  }

  fetchReserveList () {
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
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        count: body.count,
        reserveList: body.reserve_list,
      });
      if (this.props.setReservesBadgeNum) {
        this.props.setReservesBadgeNum(body.attention_count);
      }
      CacheStore.set('reservesList', body.reserve_list);
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
          <Text style={styles.headertext}>  شما  </Text>
          <Text style={styles.headertext}>{this.state.count}</Text>
          <Text style={styles.headertext}>  رزرو تایید شده دارید!  </Text>
        </View>
      );
    } else {
      return(
        <View style={styles.headerbar}>
          <Text style={styles.headertext}>شما</Text>
          <Text style={styles.headertext}> رزرو تایید شده‌ای ندارید.</Text>
        </View>
      );
    }
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  _onReservePress (reserve) {
    this.props.navigation.navigate(
      'reserveStatusScreen',
      {
        reserve: reserve,
        role: this.props.role,
        refresh: this.refreshScreen,
      }
    );
  }

  renderDuration (startDate, endDate) {
    var oneDay = 24*60*60*1000;
    startDate = Moment(startDate, 'YYYY-M-DTHH:mm:ssZ').clone();
    start = startDate.toDate();
    endDate = Moment(endDate, 'YYYY-M-DTHH:mm:ssZ').clone().toDate();
    return(Math.round(Math.abs(endDate - start)/oneDay));
  }

  renderReserveItem ({item}, navigation) {
    return(
      <TouchableOpacity onPress={() => {
        this._onReservePress(item);
      }}>
        <View style={styles.tripcard}>
        <View style={{width:8,marginRight:5,paddingBottom:48,}}>
          {item.is_host_attention_needed ?
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
            </View> :
            null}
        </View>
          <View style={styles.tripcardtexts}>
            <Text style={styles.cardtext1}>{item.room.title}</Text>
            <View style={styles.guestnames}>
              <Text style={styles.cardtext2}>متقاضی: </Text>
              <Text style={styles.cardtext2}>{item.guest_person.last_name}</Text>
              <Text style={styles.cardtext2}> / </Text>
              <Text style={styles.cardtext2}>
                {this.renderDuration(item.start_date, item.end_date)}
              </Text>
              <Text style={styles.cardtext2}> شب اقامت </Text>
            </View>
          </View>
          <View style={styles.iconbox}>
          <Icon size={24} color="#00cecc" name="hourglass-empty" />
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
          data={this.state.reserveList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderReserveItem(item, this.props.navigation)} />

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
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
  },
  cardtext2:{
    color:'#3e3e3e',
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:12,
  },
  iconbox:{
    flex:1,
    marginLeft:12,
  },
  tripcardtexts:{
    flex:5,
    marginRight:12,
  },
  guestnames:{
    flexDirection:'row-reverse',
  },
});

export default ReserveList;
