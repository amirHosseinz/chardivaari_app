// this file is not used in project

import React, {Component} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { productionURL } from './data';


class EditHouse extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      listing: {},
      price: 0,
      weekendPrice: 0,
      specialOfferPrice: 0,
      discountPerWeek: 0,
    };
  }

  componentWillMount () {
    this.setState({
      listing: this.props.navigation.state.params.listing,
    });
    this.setStatePrices(this.props.navigation.state.params.listing);
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken(token) {
    this.setState({
      token
    });
  }

  setStatePrices (listing) {
    if (listing.price != null) {
      this.setState({
        price: listing.price
      });
    } else {
      this.setState({
        price: 0
      });
    }

    if (listing.weekend_price != null) {
      this.setState({
        weekendPrice: listing.weekend_price
      });
    } else {
      this.setState({
        weekendPrice: 0
      });
    }

    if (listing.special_offer_price != null) {
      this.setState({
        specialOfferPrice: listing.special_offer_price
      });
    } else {
      this.setState({
        specialOfferPrice: 0
      });
    }

    if (listing.discount_per_week != null) {
      this.setState({
        discountPerWeek: listing.discount_per_week
      });
    } else {
      this.setState({
        discountPerWeek: 0
      });
    }
  }

  _onBackButtonPress () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
    this.props.navigation.state.params.refresh();
  }

  onSaveButtonPress () {
    fetch(productionURL + '/api/edit/listing/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        room_id: this.state.listing.id,
        price: this.state.price,
        weekend_price: this.state.weekendPrice,
        special_offer_price: this.state.specialOfferPrice,
        discount_per_week: this.state.discountPerWeek,
      }),
    })
    .then((response) => this.onEditResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onEditResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        listing: body.room,
      });
      this.setStatePrices(body.room);
      if ('discount_error' in body) {
        Alert.alert('اعداد درصد تخفیف باید کمتر از ۱۰۰ باشند.');
      } else {
        Alert.alert('اطلاعات با موفقیت ثبت شد.');
        this._onBackButtonPress();
      }
    } else if (response.status === 401) {
      // console.log('unAuthorized action.');
    } else {
      // TODO
      // error handling
    }
  }

  render () {
    return (
        <View>
            <View style={styles.header0}>
              <View style={styles.header00}>
                <TouchableOpacity onPress={this._onBackButtonPress.bind(this)}>
                    <Icon size={28} color="#ffffff" name="arrow-forward" />
                </TouchableOpacity>
                <Text style={styles.h01}>وضعیت درخواست</Text>
                <View style={{width:28}}></View>
              </View>
            </View>
          <KeyboardAwareScrollView>
          <View style={styles.container0}>
          <View style={styles.header}>
            <Text style={styles.h2}>{this.state.listing.title}</Text>
          </View>
            <View style={styles.container1}>
              <Text style={styles.upfield}>اجاره بها در روز عادی (تومان)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="25000"
                  value={String(this.state.price)}
                  placeholderTextColor="#818181"
                  keyboardType = 'numeric'
                  maxLength = {9}
                  onChangeText={price => this.setState({ price })}
                  underlineColorAndroid={'transparent'}
                  />
              <Text style={styles.upfield}>اجاره بها در آخر هفته (تومان)</Text>
                  <TextInput
                  style={styles.textInput}
                  placeholder="30000"
                  value={String(this.state.weekendPrice)}
                  placeholderTextColor="#818181"
                  keyboardType = 'numeric'
                  maxLength = {9}
                  onChangeText={weekendPrice => this.setState({ weekendPrice })}
                  underlineColorAndroid={'transparent'}
                  />
              <Text style={styles.upfield}>اجاره بها در روزهای خاص (تومان)</Text>
                  <TextInput
                  style={styles.textInput}
                  placeholder="40000"
                  value={String(this.state.specialOfferPrice)}
                  placeholderTextColor="#818181"
                  keyboardType = 'numeric'
                  maxLength = {9}
                  onChangeText={specialOfferPrice => this.setState({ specialOfferPrice })}
                  underlineColorAndroid={'transparent'}

                  />
              <Text style={styles.upfield}>درصد تخفیف هفتگی</Text>
                  <TextInput
                  style={styles.textInput}
                  placeholder="10"
                  value={String(this.state.discountPerWeek)}
                  placeholderTextColor="#818181"
                  maxLength = {3}
                  keyboardType = 'numeric'
                  onChangeText={discountPerWeek => this.setState({ discountPerWeek })}
                  underlineColorAndroid={'transparent'}
                  />
            </View>
            <View style={styles.profilepic}>
                <TouchableOpacity style={styles.buttontouch} onPress={this.onSaveButtonPress.bind(this)}>
                <View style={styles.buttonview}>
                <Text style={styles.reservebuttontext}>ذخیره</Text>
                </View>
                </TouchableOpacity>
            </View>
          </View>
          </KeyboardAwareScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    paddingTop:10,
    paddingBottom:45,
    backgroundColor:'white',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('window').width-50 ,
    alignItems: 'flex-end',
    marginTop:5,
    marginBottom:30,
  },
  editpic: {
    fontSize: 14,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color:'#4f4f4f',
  },
  textInput: {
    height: 52,
    width:Dimensions.get('window').width-50 ,
    fontSize: 18,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'right',
    color: '#4f4f4f',
    marginBottom:12,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  upfield: {
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize: 14,
    color:'#c2c2c2',
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#00cecc",
    borderRadius: 50,
    borderWidth : 1,
    height:48,
    width: 148,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:25,
  },
  buttonview: {
    backgroundColor:"#00cecc",
    borderRadius: 50,
    height:40,
    width: 140,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  h1:{
    fontSize:24,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#3e3e3e',
    marginTop:16,
  },
  h2:{
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum',
    color:'#3e3e3e',
    marginBottom:20,
    marginTop:20,

  },
  header:{
    justifyContent:'center',
    alignItems:'center',
  },
  backstyle:{
    alignItems:"flex-end",
    marginRight:10,
    marginTop:20,
  },
  header0:{
    backgroundColor:'#0ca6c1',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:5,
  },
  header00:{
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:5,
  },
  h01:{
    fontSize:20,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#ffffff',
  },
});

export default EditHouse;
