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
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TransactionRowScreen from './TransactionRowScreen';
import {
  renderPriceNumberSlashBetween,
} from './tools/renderPriceNumber';
import { productionURL } from './data';


class Transactions extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      count: 0,
      transactionList: [],
      credit: 0,
      gift_credit: 0,
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('transactionsList').then((value) => {this.setTransactionsList(value);});
  }

  setToken = (token) => {
    this.setState({
      token
    }, () => {
      this.fetchTransactionList();
      this.fetchFinancialAccount();
    });
  }

  setTransactionsList (transactionsList) {
    if (transactionsList != null) {
      this.setState({
        transactionList: transactionsList,
        count: transactionsList.length,
      });
    }
  }

  onPressBackButton () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }


  fetchTransactionList () {
    fetch(productionURL + '/finance/api/get_transactions_list/', {
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
      if (body.transaction_list) {
        this.setState({
          count: body.transaction_list.length,
          transactionList: body.transaction_list,
        });
        CacheStore.set('transactionsList', body.transaction_list);
      } else {
        this.setState({
          count: 0,
          transactionList: [],
        });
        CacheStore.set('transactionsList', []);
      }
    } else {
      // TODO
      // a eror handle
    }
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

  _keyExtractor = (item, index) => {
    return(index);
  };

  renderTransactionItem ({item}, navigation) {
    return(
      <TransactionRowScreen
        transactionItem={item}
        navigation={navigation}>
      </TransactionRowScreen>
    );
  }

  renderHeader () {
    return (
      <View style={styles.header0}>
        <View style={styles.header00}>
          <TouchableOpacity onPress={() => {
            this.onPressBackButton();
          }}>
              <Icon size={28} color='#3e3e3e' name='close' />
          </TouchableOpacity>
          <Text style={styles.h01}>
            تراکنش‌ها
          </Text>
          <View style={{width:28}}></View>
        </View>
      </View>
    );
  }

  renderCredit () {
    return renderPriceNumberSlashBetween(
      this.state.credit + this.state.gift_credit
    );
  }

  renderFooter () {
    return(
      <View style={{
        width: Dimensions.get('window').width,
        height: 60,
        borderColor: 'black',
        borderTopWidth: 1,
        alignItems: 'center',
      }}>
        <View style={{
          width: Dimensions.get('window').width - 50,
          height: 60,
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={styles.resulttext}>
            مجموع اعتبار قابل استفاده:
          </Text>
          <View style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text style={[styles.resulttextbold, {
              fontFamily: 'IRANSansMobileFaNum-Bold',
              fontSize: 20,
              marginLeft: 20,
            }]}>
              {this.renderCredit()}
            </Text>
            <Text style={styles.resulttextbold}>
              تومان
            </Text>
          </View>
        </View>

      </View>
    );
  }

  renderBody () {
    if (this.state.count > 0) {
      return(
        <View style={styles.container1}>
        <FlatList
          data={this.state.transactionList}
          keyExtractor={this._keyExtractor}
          renderItem={(item) =>
            this.renderTransactionItem(item, this.props.navigation)} />
        </View>
      );
    } else {
      return(
        <View style={styles.container1}>
        <View style={styles.notlogin}>
          <Text style={styles.notlogintext}>
            برای شما تراکنشی ایجاد نشده است.
          </Text>
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
        {this.renderFooter()}
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
  header0: {
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width,
    height: 70,
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
  container1: {
    flex: 1,
  },
  h01:{
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: '#3e3e3e',
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
  resulttext: {
    color: '#f56e4e',
    fontFamily: 'IRANSansMobileFaNum-Light',
    fontSize: 16,
    color: '#3e3e3e',
    textAlign: 'right',
  },
  resulttextbold: {
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#3e3e3e',
    textAlign: 'right',
  },
});

export default Transactions;
