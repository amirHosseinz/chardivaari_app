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

import { productionURL } from './data';


class RequestRowScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      room: {},
    };
  }

  componentWillMount () {
    if (this.props.requestItem.room) {
      this.setState({
        room: this.props.requestItem.room,
      });
    } else if (this.props.requestItem.eco_room) {
      this.setState({
        room: this.props.requestItem.eco_room,
      });
    }
  }

  renderName () {
    if (this.props.role === 'guest') {
      return(
        <View style={styles.rightAlignBox}>
        <Text style={styles.hostname}>
          {this.state.room.owner.last_name}
        </Text>
        </View>
      );
    } else if (this.props.role === 'host') {
      return(
        <View style={styles.rightAlignBox}>
        <Text style={styles.hostname}>
          {this.props.requestItem.guest_person.last_name}
        </Text>
        </View>
      );
    }
  }

  renderRoomPhoto () {
    return(
      <View style={styles.avatar}>
        <Image source={{
          uri: productionURL + this.state.room.preview_low,
        }}
        style={styles.avatarimg}/>
      </View>
    );
  }

  renderRequestStatus () {
    if (this.props.requestItem.status === 'WAIT_FOR_HOST') {
      return(
        <View style={styles.iconbox}>
          <View style={styles.iconboox}>
          <Image source={require('./img/waiting4accept.png')}
          style={styles.iconimg}/>
          </View>
        </View>
      );
    } else if (this.props.requestItem.state === 'WAIT_FOR_GUEST_PAY') {
      return(
        <View style={styles.iconbox}>
          <View style={styles.iconboox}>
          <Image source={require('./img/waiting4pay.png')}
          style={styles.iconimg}/>
          </View>
        </View>
      );
    }
  }

  _onPress() {
    this.props.navigation.navigate('requestStatus',
    {
      request: this.props.requestItem,
      role: this.props.role,
      refresh: this.props.refresh,
    });
  }

  renderAttentionBadge () {
    if (this.props.role === 'host') {
      if (this.props.requestItem.is_host_attention_needed &&
        this.props.requestItem.is_host_attention_needed == true) {
        return(
          <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
          </View>
        );
      }
    } else if (this.props.role === 'guest') {
      if (this.props.requestItem.is_guest_attention_needed &&
        this.props.requestItem.is_guest_attention_needed == true) {
          return(
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:"#f56e4e"}}>
            </View>
          );
      }
    }
  }

  render () {
    return(
    <View style={styles.container}>
      <TouchableOpacity onPress={this._onPress.bind(this)}>
        <View style={styles.msgcards}>
            <View style={{flexDirection:'row-reverse'}}>
              <View style={{width:8,marginRight:5,marginTop:5,}}>
                {this.renderAttentionBadge()}
              </View>
              {this.renderRoomPhoto()}
              <View style={styles.textbox}>
                <Text style={styles.housename}>{this.state.room.title}</Text>
                {this.renderName()}
              </View>
            </View>

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
    justifyContent:"space-between",
  },
  avatar: {
    flexDirection:"row-reverse",
    alignItems:"center",
    justifyContent: "center",
    marginLeft:3,
  },
  avatarimg: {
    height:55,
    width: 55,
    borderRadius: 27,
  },
  textbox: {
    justifyContent:"center",
    marginRight:8,
  },
  housename: {
    fontFamily: "IRANSansMobileFaNum-Medium",
    fontSize:18,
    color:'#4f4f4f',
  },
  rightAlignBox: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  hostname: {
    fontFamily: "IRANSansMobileFaNum-Light",
    fontSize:14,
    color:'#4f4f4f',
  },
  iconboox:{
    flexDirection: "row",
  },
  iconbox:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
  },
  iconimg:{
    height:35,
    width: 35,
    resizeMode:"contain",
  },
});

export default RequestRowScreen;
