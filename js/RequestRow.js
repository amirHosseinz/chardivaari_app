import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class RequestRow extends Component {

  renderStatus() {
    if (this.props.requestItem.status === 'WAIT_FOR_HOST') {
      return <Icon size={20} name={'payment'} color={'#66cdaa'} />;
    } else if (this.props.requestItem.status === 'WAIT_FOR_GUEST_PAY') {
      return <Icon size={20} name={'blur-on'} color={'#f5fffa'} />;
    } else {
      return <Icon size={20} name={'blur-on'} color={'#f5fffa'} />;
    }
  }

  onPress() {
    this.props.navigation.navigate('requestScreen',
    {
      request: this.props.requestItem,
      role: this.props.role,
      refresh: this.props.refresh,
    });
  }

  render() {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)}>
      <View style={styles.container}>
        <Text style={styles.applicant}>{this.props.requestItem.room.owner}</Text>
        <Text style={styles.listingTitleStyle}>{this.props.requestItem.room.title}</Text>
        <View style={styles.statusStyle}>
          {this.renderStatus()}
        </View>
      </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d3d3d3',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontSize: 12,
    color: 'black',
  },
  statusStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  applicant: {
    fontSize: 15,
  },
  listingTitleStyle: {
    fontWeight: 'bold',
    paddingRight: 10,
  },
});

export default RequestRow;
