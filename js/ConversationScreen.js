import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


class ConversationScreen extends Component {

  constructor(props) {
    super(props);
    this.state={
      partyName: '',
      partyImageUrl: null,
      messages: [],
    };
  }

  componentWillMount() {
    this.setState({ partyName: this.props.navigation.state.params.partyName});
    this.setState({ partyImageUrl: 'https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg' });
    this.setState({
      messages: [
        {
          _id: 4,
          text: 'قابل شما رو نداره.',
          createdAt: new Date(2017, 7, 20, 22, 36, 47, 123),
          user: {
            _id: 2,
            name: 'علی محسنی',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
        {
          _id: 3,
          text: 'چکر! آقا خونه‌ات چند؟',
          createdAt: new Date(2017, 6, 12, 11, 20, 50, 134),
          user: {
            _id: 1,
          },
        },
        {
          _id: 2,
          text: 'قربانت. شما چطوری؟',
          createdAt: new Date(2017, 6, 12, 10, 55, 126),
          user: {
            _id: 2,
            name: 'علی محسنی',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
        {
          _id: 1,
          text: 'چونی عزیز؟',
          createdAt: new Date(2017, 6, 10, 23, 59, 54),
          user: {
            _id: 1,
          },
        },
      ],
    });
    if (this.props.navigation.state.params.message !== null) {
      this.onSend(this.props.navigation.state.params.message);
    }
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={styles.conversationHeader} >
          <Text style={styles.text} >{this.state.partyName}</Text>
          <Image style={styles.profileImageStyle} source={{ uri: this.state.partyImageUrl }} />
        </View>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationHeader: {
    width: Dimensions.get('screen').width,
    height: 70,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdf5e6',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 20 },
    shadowOpacity: 1,
    elevation: 2,
    position: 'relative'
  },
  text: {
    fontSize: 30,
    color: 'black',
  },
  profileImageStyle: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
});

export default ConversationScreen;
