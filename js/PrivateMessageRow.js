import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';

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
    if (value == this.props.message.sender.username) {
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
    if (this.props.message.sender.username == this.state.username) {
      return(
        <View style={styles.rightAlignBox}>
        <Text style={styles.hostname}>{this.props.message.recipient.last_name}</Text>
        </View>
      );
    } else if (this.props.message.recipient.username === this.state.username) {
      return(
        <View style={styles.rightAlignBox}>
        <Text style={styles.hostname}>{this.props.message.sender.last_name}</Text>
        </View>
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
    if ((this.props.message.sender.profile_picture != null) &&
      (this.props.message.recipient.username === this.state.username)) {
        return(
          <View style={styles.avatar}>
            <Image source={{
              uri: productionURL + this.props.message.sender.profile_picture,
            }}
            style={styles.avatarimg} />
          </View>
        );
    } if ((this.props.message.recipient.profile_picture != null) &&
      (this.props.message.sender.username === this.state.username)) {
        return(
          <View style={styles.avatar}>
            <Image source={{
              uri: productionURL + this.props.message.recipient.profile_picture,
            }}
            style={styles.avatarimg} />
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
    if (this.props.message.room) {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.party,
          messageId: this.props.message.id,
          username: this.state.username,
          room: this.props.message.room,
        }
      );
    } else if (this.props.message.eco_room) {
      this.props.navigation.navigate(
        'conversationScreen',
        {
          party: this.state.party,
          messageId: this.props.message.id,
          username: this.state.username,
          eco_room: this.props.message.eco_room,
        }
      );
    }
  }

  render () {
    return(
    <View style={styles.container}>
    <TouchableOpacity onPress={this._onPress.bind(this)}>
      <View style={styles.msgcards}>
        {this.renderProfilePicture()}
        <View style={styles.textbox}>
          {this.renderHostname()}
          <View style={styles.rightAlignBox}>
          <Text style={styles.housename}>{this.props.message.subject}</Text>
          </View>
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
    width: Dimensions.get('window').width - 10,
    height: 75,
    backgroundColor: '#f9f9f9',
    marginTop:5,
    borderRadius: 1,
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
    height: 50,
    width: 50,
    borderRadius: 25,
  },
textbox: {
  flex:18,
  justifyContent:"center",
  marginRight:8,
},
housename: {
  fontFamily: "IRANSansMobileFaNum-Light",
  fontSize:14,
  color:'#4f4f4f',
},
rightAlignBox:{
  flexDirection: "row-reverse",
  alignItems: "flex-start",
},
hostname: {
  fontFamily: "IRANSansMobileFaNum-Medium",
  fontSize:18,
  color:'#4f4f4f',
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
