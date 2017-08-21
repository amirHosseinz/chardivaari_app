import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class InboxRow extends Component {

  renderStatus() {
    if (this.props.message.message.status === 'unread') {
      return <Icon size={20} name={'radio-button-unchecked'} color={'#ff4500'} />;
    }
  }

  onPress() {
    // Alert.alert('here');
    this.props.navigation.navigate('conversationScreen', {partyName: this.props.message.message.partyName});
  }

  render() {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)} >
      <View style={styles.container} >
        <Text>{this.props.message.message.partyName}</Text>
        <Text>{this.props.message.message.title}</Text>
        <View style={styles.statusStyle} >
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
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#d3d3d3',
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
});

export default InboxRow;
