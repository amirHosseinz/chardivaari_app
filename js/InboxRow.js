import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

class InboxRow extends Component {
  constructor(props) {
    super(props);
    this.state={
      partyName: '',
      imSender: false,
      username: '',
    };
  }

  componentWillMount() {
    CacheStore.get('username').then((value) => this.setPartyName(value));
  }

  setPartyName(myName) {
    if (myName === this.props.message.sender) {
      this.setState({
        partyName: this.props.message.recipient,
        imSender: true,
        username: myName,
      });
    } else {
      this.setState({
        partyName: this.props.message.sender,
        username: myName,
      });
    }
  }

  renderStatus() {
    if (this.props.message.read_at == null && this.state.imSender) {
      return <Icon size={20} name={'radio-button-unchecked'} color={'#ff4500'} />;
    }
  }

  onPress() {
    this.props.navigation.navigate(
      'conversationScreen',
      {
        partyName: this.state.partyName,
        messageId: this.props.message.id,
        username: this.state.username,
      }
    );
  }

  render() {
    return(
      <TouchableOpacity onPress={this.onPress.bind(this)} >
      <View style={styles.container} >
        <Text>{this.state.partyName}</Text>
        <Text>{this.props.message.subject}</Text>
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
