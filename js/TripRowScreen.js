import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';


class TripRowScreen extends Component {
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

  renderIcon () {
    switch(this.state.reserve.status) {
    case 'IN_PROGRESS':
      return(
        <View style={styles.iconbox}>
        <Icon size={24} color="#00cecc" name="hourglass-empty" />
        </View>
      );
      break;
    case 'DONE':
      return(
        <View style={styles.iconbox}>
        <Icon size={24} color="#00cecc" name="check-circle" />
        </View>
      );
      break;
    case 'RESOLUTION':
      return(
        <View style={styles.iconbox}>
        <Icon size={24} color="#f56e4e" name="report-problem" />
        </View>
      );
      break;
      case 'ISSUED':
        return(
          <View style={styles.iconbox}>
          <Icon size={24} color="#00cecc" name="insert-invitation" />
          </View>
        );
        break;
    case 'CANCELED_BY_HOST':
      return(
        <View style={styles.iconbox}>
        <Icon size={24} color="#f56e4e" name="cancel" />
        </View>
      );
      break;
    case 'CANCELED_BY_GUEST':
      return(
        <View style={styles.iconbox}>
        <Icon size={24} color="#f56e4e" name="cancel" />
        </View>
      );
      break;
    default:
    }
  }

  _onPress () {
    this.props.navigation.navigate(
      'tripStatusScreen',
      {
        trip: this.state.reserve,
        role: this.props.role,
        refresh: this.props.refreshScreen,
      }
    );
  }

  render () {
    return(
      <TouchableOpacity onPress={() => {
        this._onPress();
      }}>
        <View style={styles.tripcard}>
        <View style={styles.badgeWrapper}>
          {this.renderBadge()}
        </View>
          <View style={styles.tripcardtexts}>
          <View style={styles.rightAlignBox}>
            <Text style={styles.cardtext1}>
              {this.state.room.title}
            </Text>
            </View>
            <View style={styles.rightAlignBox}>
            <Text style={styles.cardtext2}>
              {this.state.room.address}
            </Text>
            </View>
          </View>
          {this.renderIcon()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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
});

export default TripRowScreen;
