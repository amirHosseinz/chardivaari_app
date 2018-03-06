import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import moment from 'moment-jalaali';

import { productionURL } from './data';


class ReserveRowScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      room: {},
      reserve: {},
    };
  }

  componentWillMount () {
    if (this.props.reserveItem.room) {
      this.setState({
        room: this.props.reserveItem.room,
        reserve: this.props.reserveItem,
      });
    } else if (this.props.reserveItem.eco_room) {
      this.setState({
        room: this.props.reserveItem.eco_room,
        reserve: this.props.reserveItem,
      });
    }
  }

  renderBadge () {
    if (this.state.reserve.is_guest_attention_needed) {
      return(
        <View style={styles.badgeStyle}>
        </View>
      );
    } else {
      return null;
    }
  }

  _onReservePress () {
    this.props.navigation.navigate(
      'reserveStatusScreen',
      {
        reserve: this.state.reserve,
        role: this.props.role,
        refresh: this.props.refreshScreen,
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

  render () {
    return(
      <TouchableOpacity onPress={() => {
        this._onReservePress();
      }}>
        <View style={styles.tripcard}>
        <View style={{width:8,marginRight:5,paddingBottom:48,}}>
          {this.state.reserve.is_host_attention_needed ?
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
            </View> :
            null}
        </View>
          <View style={styles.tripcardtexts}>
            <Text style={styles.cardtext1}>{this.state.room.title}</Text>
            <View style={styles.guestnames}>
              <Text style={styles.cardtext2}>متقاضی: </Text>
              <Text style={styles.cardtext2}>{this.state.reserve.guest_person.last_name}</Text>
              <Text style={styles.cardtext2}> / </Text>
              <Text style={styles.cardtext2}>
                {this.renderDuration(this.state.reserve.start_date, this.state.reserve.end_date)}
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
}

const styles = StyleSheet.create({
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
  rightAlignBox: {
    flexDirection: 'row-reverse',
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
  badgeStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f56e4e",
  },
  badgeWrapper: {
    width: 8,
    marginRight: 5,
    paddingBottom: 48,
  },
  guestnames:{
    flexDirection:'row-reverse',
  },
});

export default ReserveRowScreen;
