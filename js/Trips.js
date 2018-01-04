import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

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
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        tripList: body.reserve_list,
        count: body.reserve_list.length,
      });
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
          <View style={{width:8,marginRight:5,paddingBottom:48,}}>
            {item.is_guest_attention_needed ?
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
              </View> :
              null}
          </View>
            <View style={styles.tripcardtexts}>
            <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              </View>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
              </View>
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
          <View style={{width:8,marginRight:5,paddingBottom:48,}}>
            {item.is_guest_attention_needed ?
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
              </View> :
              null}
          </View>
            <View style={styles.tripcardtexts}>
            <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              </View>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
              </View>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#00cecc" name="check-circle" />
            </View>
          </View>
        </TouchableOpacity>
      );
      break;
    case 'RESOLUTION':
      return(
        <TouchableOpacity onPress={() => {
          this._onTripPress(item);
        }}>
          <View style={styles.tripcard}>
          <View style={{width:8,marginRight:5,paddingBottom:48,}}>
            {item.is_guest_attention_needed ?
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
              </View> :
              null}
          </View>
            <View style={styles.tripcardtexts}>
            <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              </View>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
              </View>
            </View>
            <View style={styles.iconbox}>
            <Icon size={24} color="#f56e4e" name="report-problem" />
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
            <View style={{width:8,marginRight:5,paddingBottom:48,}}>
              {item.is_guest_attention_needed ?
                <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
                </View> :
                null}
            </View>
              <View style={styles.tripcardtexts}>
              <View style={styles.rightAlignBox}>
                <Text style={styles.cardtext1}>
                  {item.room.title}
                </Text>
                </View>
                <View style={styles.rightAlignBox}>
                <Text style={styles.cardtext2}>
                  {item.room.district} ،{item.room.address}
                </Text>
                </View>
              </View>
              <View style={styles.iconbox}>
              <Icon size={24} color="#00cecc" name="insert-invitation" />
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
          <View style={{width:8,marginRight:5,paddingBottom:48,}}>
            {item.is_guest_attention_needed ?
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
              </View> :
              null}
          </View>
            <View style={styles.tripcardtexts}>
            <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              </View>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
              </View>
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
          <View style={{width:8,marginRight:5,paddingBottom:48,}}>
            {item.is_guest_attention_needed ?
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
              </View> :
              null}
          </View>
            <View style={styles.tripcardtexts}>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext1}>
                {item.room.title}
              </Text>
              </View>
              <View style={styles.rightAlignBox}>
              <Text style={styles.cardtext2}>
                {item.room.district} ،{item.room.address}
              </Text>
              </View>
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
  tripcard: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 10,
    height: 65,
    backgroundColor: '#f9f9f9',
    marginTop:5,
    borderRadius: 1,
    flexDirection: "row-reverse",
    justifyContent:"flex-start",
    alignItems: 'center',
},
  rightAlignBox: {
    flexDirection: 'row-reverse',
  },
  cardtext1:{
    textAlign: 'right',
    alignSelf: 'stretch',
    color:'#3e3e3e',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:16,
  },
  cardtext2:{
    textAlign: 'right',
    alignSelf: 'stretch',
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
    marginRight:5,
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
