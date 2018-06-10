import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-jalaali';

import { productionURL } from './data';
import {
  renderPriceNumberCommaBetween,
} from './tools/renderPriceNumber';

class TransactionRowScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      transaction: {},
    };
  }

  componentWillMount () {
    if (this.props.transactionItem) {
      this.setState({
        transaction: this.props.transactionItem,
      });
    }
  }

  renderIcon () {
    if (this.state.transaction.transaction_type === 'TRAVEL') {
      return (
        <Icon size={23} color='#bbbbbb' name='remove' />
      );
    } else if (this.state.transaction.transaction_type === 'CHARGE') {
      return (
        <Icon size={23} color='#bbbbbb' name='add' />
      );
    } else if (this.state.transaction.transaction_type === 'GIFT') {
      return (
        <Icon size={23} color='#bbbbbb' name='add' />
      );
    } else if (this.state.transaction.transaction_type === 'EARNING') {
      return (
        <Icon size={23} color='#bbbbbb' name='add' />
      );
    } else if (this.state.transaction.transaction_type === 'EARNEST') {
      return (
        <Icon size={23} color='#bbbbbb' name='add' />
      );
    } else if (this.state.transaction.transaction_type === 'DEPOSIT') {
      return (
        <Icon size={23} color='#bbbbbb' name='remove' />
      );
    } else if (this.state.transaction.transaction_type === 'REFUND') {
      if (this.state.transaction.refund_description === 'GUEST') {
        return (
          <Icon size={23} color='#bbbbbb' name='add' />
        );
      } else if (this.state.transaction.refund_description === 'HOST') {
        return (
          <Icon size={23} color='#bbbbbb' name='remove' />
        );
      } else {
        return (
          <Icon size={23} color='#bbbbbb' name='remove' />
        );
      }
    } else {
      return (
        <Icon size={23} color='#bbbbbb' name='add' />
      );
    }
  }

  renderJalaliDate (date) {
    return moment(date, 'YYYY-M-DTHH:mm:ssZ').format('jYYYY/jM/jD');
  }

  renderTime (date) {
    date = date.split('T')[1];
    date = date.split('.')[0];
    date = date.split('+')[0];
    return date;
  }

  renderAmount () {
    amount = 0;
    amount += this.state.transaction.value;
    amount += this.state.transaction.gift_value;
    return renderPriceNumberCommaBetween(amount);
  }

  renderDescription () {
    if (this.state.transaction.transaction_type === 'TRAVEL') {
      if (this.state.transaction.travel_description &&
        this.state.transaction.travel_description.reserved_ecotourism) {
          description = 'جهت رزرو بومگردی ';
          description += this.state.transaction.travel_description.reserved_ecotourism.title;
          return(description);
      } else if (this.state.transaction.travel_description &&
        this.state.transaction.travel_description.reserved_room) {
          description = 'جهت رزرو ';
          description += this.state.transaction.travel_description.reserved_room.title;
          return(description);
      } else {
        return(
          'جهت رزرو اقامت‌گاه'
        );
      }
    } else if (this.state.transaction.transaction_type === 'CHARGE') {
      return(
        'افزایش اعتبار'
      );
    } else if (this.state.transaction.transaction_type === 'GIFT') {
      if (this.state.transaction.gift_description &&
        this.state.transaction.gift_description.reason === 'SIGN_UP_WITH_REFERRAL') {
          return(
            'اعتبار هدیه‌ی اولیه‌ی تریپین'
          );
      } else if (this.state.transaction.gift_description &&
        this.state.transaction.gift_description.reason === 'FIRST_TRIP') {
          description = 'اعتبار هدیه‌ی اولین سفر ';
          description += this.state.transaction.gift_description.referred_person.first_name + ' ';
          description += this.state.transaction.gift_description.referred_person.last_name;
          return(description);
      }
    } else if (this.state.transaction.transaction_type === 'DEPOSIT') {
      return(
        'برداشت از حساب'
      );
    } else if (this.state.transaction.transaction_type === 'REFUND') {
      return(
        'بازگشت وجه'
      );
    } else if (this.state.transaction.transaction_type === 'EARNING') {
      if (this.state.transaction.earning_description &&
        this.state.transaction.earning_description.room) {
          description = 'پرداخت نهایی برای رزرو ';
          description += this.state.transaction.earning_description.room.title;
          return(description);
      } else if (this.state.transaction.earning_description &&
        this.state.transaction.earning_description.ecotourism) {
          description = 'پرداخت نهایی برای رزرو بومگردی ';
          description += this.state.transaction.earning_description.ecotourism.title;
          return(description);
      } else {
        return(
          'پرداخت نهایی برای رزرو'
        );
      }
    } else if (this.state.transaction.transaction_type === 'EARNEST') {
      if (this.state.transaction.earnest_description &&
        this.state.transaction.earnest_description.room) {
          description = 'پیش پرداخت برای رزرو ';
          description += this.state.transaction.earnest_description.room.title;
          return(description);
      } else if (this.state.transaction.earnest_description &&
        this.state.transaction.earnest_description.ecotourism) {
          description = 'پیش پرداخت برای رزرو بومگردی ';
          description += this.state.transaction.earnest_description.ecotourism.title;
          return(description);
      } else {
        return(
          'پیش پرداخت جهت رزرو'
        );
      }
    } else {
      return('');
    }
  }

  render () {
    return(
      <View style={styles.transactioncard}>
        <View style={{
          flex: 2,
          height: 70,
          flexDirection: 'row-reverse',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
          <View style={{
            marginRight: 15,
          }}>
            {this.renderIcon()}
          </View>

          <View style={{
            marginRight: 15,
          }}>
            <View style={{
              flex: 1,
              height: 70,
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}>
              <Text style={styles.resulttextbold}>{this.renderAmount()}</Text>
              <Text style={styles.resulttextbold}>{this.renderDescription()}</Text>
            </View>
          </View>
        </View>
        <View style={{
          flex: 1,
          height: 70,
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginLeft: 15,
        }}>
          <Text style={styles.resulttextbold}>
            {this.renderJalaliDate(this.state.transaction.date_time)}
          </Text>
          <Text style={styles.resulttextbold}>
            {this.renderTime(this.state.transaction.date_time)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  transactioncard: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 20,
    height: 65,
    backgroundColor: '#f9f9f9',
    marginTop: 5,
    borderRadius: 3,
    flexDirection: "row-reverse",
    justifyContent:"flex-start",
    alignItems: 'center',
  },
  resulttextbold:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:14,
    color:'#3e3e3e',
    textAlign: 'right',
  },
});

export default TransactionRowScreen;
