import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import TripRowScreen from './TripRowScreen';
import { productionURL, GATrackerId } from './data';


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
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('Trips');
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('tripsList').then((value) => {this.setTripList(value);});
  }

  setTripList (tripsList) {
    if (tripsList != null) {
      this.setState({
        tripList: tripsList,
        count: tripsList.length,
      });
    }
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchTripList ());
  }

  fetchTripList () {
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
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.reserve_list) {
        this.setState({
          tripList: body.reserve_list,
          count: body.reserve_list.length,
        });
      } else {
        this.setState({
          tripList: [],
          count: 0,
        });
      }

      if (this.props.setTripsBadgeNum) {
        this.props.setTripsBadgeNum(body.attention_count);
      }
      CacheStore.set('tripsList', body.reserve_list);
    } else {
      // TODO
      // a eror handle
    }
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  _keyExtractor = (item, index) => item.id;

  renderTripItem ({item}, navigation) {
    return(
      <TripRowScreen
      reserveItem={item}
      navigation={navigation}
      role={this.props.role}
      refreshScreen={this.refreshScreen}>
      </TripRowScreen>
    );
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

  changeToExploreTab = () => {
    if (this.props.goToTab) {
      this.props.goToTab('explore');
    }
  }

  renderBody () {
    if (this.state.count > 0) {
      return(
        <View style={styles.container1}>
        <FlatList
          data={this.state.tripList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderTripItem(item, this.props.navigation)}/>
        </View>
      );
    } else {
      return(
        <View style={styles.container1}>
        <View style={styles.notlogin}>
          <Text style={styles.notlogintext}> برای سفر جدید به بخش جستجو مراجعه کنید! </Text>
          <TouchableOpacity style={styles.logintouch} onPress={this.changeToExploreTab}>
            <Text style={styles.notlogintext1}> بخش جستجو </Text>
          </TouchableOpacity>
        </View>
        </View>
      );
    }
  }

  render () {
    return(
      <View style={styles.container0}>
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#ededed',
  },
  headerbar: {
    flexDirection:'row-reverse',
    width:Dimensions.get('window').width,
    backgroundColor:"#0ca6c1",
    alignItems:'center',
    justifyContent:'center',
    ...Platform.select({
      ios: {
        height: 70,
      },
      android: {
        height: 80,
        marginBottom: 4,
        elevation: 3,
      },
    }),
  },
  headertext:{
    marginTop: 20,
    color:'#e5e5e5',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:18,
  },
  notlogin:{
    alignItems:'center',
    marginTop:40,
    width: Dimensions.get('window').width - 20,
  },
  notlogintext:{
    color:'#616161',
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize:18,
    textAlign:'center',
    marginTop:0,
    marginBottom:0,
  },
  notlogintext1:{
    color:'#f56e4e',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:18,
    textAlign:'center',
    marginTop:0,
    marginBottom:0,
  },
  logintouch:{
    flexDirection:'row-reverse',
    alignItems:'center'
  },
});

export default Trips;
