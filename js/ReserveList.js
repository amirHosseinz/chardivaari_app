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

import ReserveRowScreen from './ReserveRowScreen'
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
    fetch(productionURL + '/api/v1/reservations/list/', {
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
      if (body.reserve_list) {
        this.setState({
          count: body.reserve_list.length,
          reserveList: body.reserve_list,
        });
      } else {
        this.setState({
          count: 0,
          reserveList: [],
        });
      }
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
          <Text style={styles.headertext}> شما </Text>
          <Text style={styles.headertext}> رزرو تایید شده‌ای ندارید.</Text>
        </View>
      );
    }
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  renderReserveItem ({item}, navigation) {
    return(
      <ReserveRowScreen
      reserveItem={item}
      navigation={navigation}
      role={this.props.role}
      refreshScreen={this.refreshScreen}>
      </ReserveRowScreen>
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
});

export default ReserveList;
