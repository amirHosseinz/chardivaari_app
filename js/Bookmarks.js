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

import BookmarkRowScreen from './BookmarkRowScreen';
import { productionURL, GATrackerId } from './data';


class Bookmarks extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      count: 0,
      bookmarksList: [],
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('Bookmarks');
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('bookmarksList').then((value) => {this.setBookmarksList(value);});
  }

  setBookmarksList (bookmarksList) {
    if (bookmarksList != null) {
      this.setState({
        bookmarksList: bookmarksList,
        count: bookmarksList.length,
      });
    }
  }

  setToken(token) {
    this.setState({
      token
    }, () => this.fetchBookmarksList ());
  }

  fetchBookmarksList () {
    fetch(productionURL + '/bookmark/api/list/', {
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
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.faved_rooms) {
        this.setState({
          bookmarksList: body.faved_rooms,
          count: body.faved_rooms.length,
        });
      } else {
        this.setState({
          bookmarksList: [],
          count: 0,
        });
      }
      CacheStore.set('bookmarksList', body.faved_rooms);
    } else {
      // TODO
      // a eror handle
    }
  }

  refreshScreen = () => {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  _keyExtractor = (item, index) => item.id;

  renderbookmarkItem ({item}, navigation) {
    return(
      <BookmarkRowScreen
        bookmarkItem={item}
        navigation={navigation}
        role={this.props.role}
        refreshScreen={this.refreshScreen}>
      </BookmarkRowScreen>
    );
  }

  renderHeader () {
    return(
      <View style={styles.headerbar}>
        <Text style={styles.headertext}>لیست علاقه‌مندی‌ها</Text>
      </View>
    );
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
          data={this.state.bookmarksList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) => this.renderbookmarkItem(item, this.props.navigation)}/>
        </View>
      );
    } else {
      return(
        <View style={styles.container1}>
        <View style={styles.notlogin}>
          <Text style={styles.notlogintext}>برای یافتن علاقه‌مندی‌ها به بخش جستجو مراجعه کنید!</Text>
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

export default Bookmarks;
