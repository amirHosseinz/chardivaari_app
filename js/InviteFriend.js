import React, { Component } from 'react';
import {
  Text,
  Share,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';

class InviteFriend extends Component {
  constructor(props) {
    super(props);
    this.state={
      referralCode: null,
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken = (token) => {
    this.setState({
      token
    }, () => {
      this.fetchFinancialAccount();
    });
  }

  fetchFinancialAccount () {
    fetch(productionURL + '/finance/api/get_finance_account/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onFinancialAccountResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.error(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجددا امتحان نمایید.');
    });
  }

  onFinancialAccountResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        referralCode: body.referral_code,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  onSharePress () {
    if (this.state.referralCode) {
      Share.share({
        message: 'www.tripinn.ir/users/'+this.state.referralCode,
      })
      .then(result => console.log(result))
      .catch(err => console.log(err));
    }
  }

  onPressBackButton () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  renderReferralCode () {
    if (this.state.referralCode) {
      return(
        <Text style={styles.referralTextStyleLeft}>
          {this.state.referralCode}
        </Text>
      );
    }
    return null;
  }

  render () {
    return(
      <View style={styles.container}>

      <View style={styles.header0}>
        <View style={styles.header00}>
          <TouchableOpacity onPress={() => {
            this.onPressBackButton();
          }}>
            <Icon size={28} color='#3e3e3e' name='close' />
          </TouchableOpacity>
          <Text style={styles.h1}>
            اعتبار هدیه
          </Text>
          <View style={{width:28}}></View>
        </View>
      </View>
      <View style={styles.container2}>
        <Image
          style={styles.logostyle}
          source={require('./img/financialAccount/invite_image.png')} />
        <Text style={{
          fontSize: 26,
          fontFamily: 'IRANSansMobileFaNum-Bold',
          textAlign: 'center',
          color: 'black',
          marginTop: 50,
        }}>
          پنجاه هزار تومان
          اعتبار تریپینی
        </Text>
        <Text style={styles.aboutustext}>
          با معرفی تریپین
          به دوستان خود،
          به ازای هر سفر
          توسط آن‌ها،
          ۵۰
          هزار تومان
          اعتبار هدیه
          به شما
          و
          ۵۰
          هزار تومان
          تخفیف
          به دوستتان تعلق
          خواهد گرفت.
        </Text>
        <View style={styles.referralContainer}>
          <Text style={styles.referralTextStyleRight}>
            کد معرف:
          </Text>
          {this.renderReferralCode()}
        </View>

        <TouchableOpacity
          style={styles.buttontouch}
          onPress={this.onSharePress.bind(this)}>
          <View style={styles.buttonview}>
          <Text style={styles.reservebuttontext}>
            معرفی به دوستان
          </Text>
        </View>
        </TouchableOpacity>

      </View>

    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  container2: {
    marginTop: 55,
    alignItems:'center',
  },
  referralContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  referralTextStyleRight: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Light',
    textAlign: 'center',
    color: '#4f4f4f',
    marginTop: 25,
  },
  referralTextStyleLeft: {
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Bold',
    textAlign: 'center',
    color: '#4f4f4f',
    marginTop: 25,
  },
  logostyle: {
    height: 100,
    resizeMode: 'contain',
  },
  aboutustext: {
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Light',
    textAlign: 'center',
    color: '#4f4f4f',
    width: Dimensions.get('window').width - 90,
  },
  header0: {
    backgroundColor:'#ffffff',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      android: {
      },
    }),
  },
  header00: {
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        marginTop:14,
      },
      android: {
      },
    }),
  },
  h1: {
    fontSize: 18,
    fontFamily: "IRANSansMobileFaNum-Medium",
    color: "#3e3e3e",
  },
  buttontouch: {
    width: Dimensions.get('window').width - 100,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonview: {
    flex: 1,
    backgroundColor: '#00cde3',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    ...Platform.select({
      ios: {
        borderRadius: 24,
      },
      android: {
        borderRadius: 22,
      },
    }),
  },
  reservebuttontext: {
    fontSize: 19,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: '#ffffff',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 12,
    paddingLeft: 12,
    marginBottom: 5,
  },
});

export default InviteFriend;
