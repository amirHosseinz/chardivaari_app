import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';

class PrivateMessageRow extends Component {
  constructor (props) {
    super(props);
    this.state={
      username: null,
      party: null,
    };
  }

  componentWillMount () {
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  setUsername (value) {
    this.setState({
      username: value,
    });
    if (value === this.props.message.sender.username) {
      this.setState({
        party: this.props.message.recipient,
      });
    } else {
      this.setState({
        party: this.props.message.sender,
      });
    }
  }

  renderHostname () {
    if (this.props.message.sender.username === this.state.username) {
      return(
        <Text style={styles.hostname}>{this.props.message.recipient.last_name}</Text>
      );
    } else if (this.props.message.recipient.username === this.state.username) {
      return(
        <Text style={styles.hostname}>{this.props.message.sender.last_name}</Text>
      );
    }
  }

  renderReadStatus () {
    if ((this.props.message.recipient.username === this.state.username) &&
      (this.props.message.read_at == null)) {
        return(
          <View style={styles.badgebox}>
            <View style={styles.badge}>
            </View>
          </View>
        );
    }
  }

  renderProfilePicture () {
    if (this.props.message.sender.profile_picture != null) {
      return(
        <View style={styles.avatar}>
          <Image source={{
            uri: productionURL + this.props.message.sender.profile_picture,
          }}
          style={styles.avatarimg}/>
        </View>
      );
    } else {
      return(
        <View style={styles.avatar}>
          <Icon
            name='account-circle'
            size={55}
            color='#c2c2c2'
            style={styles.avatarimg}
          />
        </View>
      );
    }
  }

  _onPress() {
    this.props.navigation.navigate(
      'conversationScreen',
      {
        party: this.state.party,
        messageId: this.props.message.id,
        username: this.state.username,
        room: this.props.message.room,
      }
    );
  }

  render () {
    return(
    <View style={styles.container}>
    <TouchableOpacity onPress={this._onPress.bind(this)}>
      <View style={styles.msgcards}>
        {this.renderProfilePicture()}
        <View style={styles.textbox}>
          {this.renderHostname()}
          <Text style={styles.housename}>{this.props.message.subject}</Text>
        </View>
        {this.renderReadStatus()}
      </View>
    </TouchableOpacity>
    </View>
  );
}
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:"center",
    backgroundColor: "#e5e5e5",
  },
  msgcards: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 20,
    height: 75,
    backgroundColor: '#ffffff',
    marginTop:5,
    borderRadius: 3,
    flexDirection: "row-reverse",
    justifyContent:"flex-start",
  },
  avatar: {
  flex:5,
  flexDirection:"row-reverse",
  alignItems:"center",
  justifyContent: "center",
  marginLeft:5,
  },
  avatarimg: {
    height:55,
    width: 55,
    borderRadius:50,
  },
textbox: {
  flex:18,
  justifyContent:"center",
  marginRight:8,
},
housename: {
  fontFamily: "Vazir-Light",
  fontSize:14,
},
hostname: {
  fontFamily: "Vazir-Medium",
  fontSize:18,
},
iconboox:{
  flexDirection: "row",
},
iconbox:{
  flex:5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent:'center',
},
iconimg:{
  height:35,
  width: 35,
  resizeMode:"contain",
},
badge: {
  height:10,
  width:10,
  backgroundColor:'#f56e4e',
  borderRadius:13,
  marginTop:10,
  marginLeft:10,
}
});

export default PrivateMessageRow;
