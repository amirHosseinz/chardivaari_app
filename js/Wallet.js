import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  renderPriceNumberSlashBetween,
  renderPriceNumberCommaBetween,
} from './tools/renderPriceNumber';
import { productionURL } from './data';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state={
      token: null,
      credit: 0,
      gift_credit: 0,
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
        credit: body.credit,
        gift_credit: body.gift_credit,
      });
    } else {
      // TODO
      // a eror handle
    }
  }

  onPressBackButton () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  renderTransactionBadge () {
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
              <Icon size={28} color='white' name="arrow-forward" />
          </TouchableOpacity>
          <Text style={styles.h01}>
            کیف پول
          </Text>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('transactions');
          }}>
            {this.renderTransactionBadge()}
            <Text style={styles.h01}>
              تراکنش‌ها
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
      <View style={styles.body}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={styles.totalCreditSection}>
            <Text style={[styles.resulttextbold, {fontSize:20,}]}>
              {renderPriceNumberSlashBetween(this.state.credit + this.state.gift_credit)}
            </Text>
            <Text style={[styles.resulttext, {marginRight: 20,}]}>
              تومان
            </Text>
          </View>
          <Text style={[styles.resulttext, {marginTop: 30,}]}>
            مجموع اعتبار قابل استفاده
          </Text>
        </View>
        <View style={styles.fullDivider}>
        </View>
        <View style={{
          flex: 1,
          width: Dimensions.get('window').width - 50,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              style={styles.giftCreditImage}
              source={require('./img/financialAccount/total_credit.png')} />
            <View style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={[styles.resulttextbold, {marginLeft:10,}]}>
                {renderPriceNumberCommaBetween(this.state.credit)}
              </Text>
              <Text style={styles.resulttext}>
                تومان
              </Text>
            </View>
            <Text style={styles.resulttext}>
              موجودی حساب
            </Text>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              style={styles.giftCreditImage}
              source={require('./img/financialAccount/gift_credit.png')} />
            <View style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={[styles.resulttextbold, {marginLeft:10,}]}>
                {renderPriceNumberCommaBetween(this.state.gift_credit)}
              </Text>
              <Text style={styles.resulttext}>
                تومان
              </Text>
            </View>
            <Text style={styles.resulttext}>
              اعتبار هدیه
            </Text>
          </View>
        </View>
        <View style={styles.partDivider}>
        </View>
        <View style={{flex: 1,}}>
        </View>
      </View>
      </ScrollView>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'space-between',
  },
  header0: {
    backgroundColor: '#12b2ce',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation: 3,
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
  h01:{
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: 'white',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalCreditSection: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 32,
  },
  fullDivider: {
    height: 2,
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
    marginTop: 16,
    marginBottom: 16,
  },
  partDivider: {
    height: 1,
    width: Dimensions.get('window').width - 50,
    backgroundColor: '#d7d7d7',
    marginTop: 16,
    marginBottom: 16,
  },
  giftCreditImage: {
    height: 100,
    resizeMode: 'contain',
  },
  resulttext: {
    color: '#f56e4e',
    fontFamily: 'IRANSansMobileFaNum-Light',
    fontSize: 14,
    color: '#3e3e3e',
    textAlign: 'right',
  },
  resulttextbold: {
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize: 16,
    color:'#3e3e3e',
    textAlign: 'right',
  },
});

export default Wallet;
