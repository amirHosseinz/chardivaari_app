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

import { testURL, productionURL } from './data';


class RequestRowScreen extends Component {

  componentWillMount () {
  }

  renderName () {
    if (this.props.role === 'guest') {
      return(
        <Text style={styles.hostname}>
          {this.props.requestItem.room.owner.last_name}
        </Text>
      );
    } else if (this.props.role === 'host') {
      return(
        <Text style={styles.hostname}>
          {this.props.requestItem.guest_person.last_name}
        </Text>
      );
    }
  }

  renderRoomPhoto () {
    return(
      <View style={styles.avatar}>
        <Image source={{
          uri: productionURL + this.props.requestItem.room.preview,
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
    // this.props.navigation.navigate('requestScreen',
    // {
    //   request: this.props.requestItem,
    //   role: this.props.role,
    //   refresh: this.props.refresh,
    // });
    this.props.navigation.navigate('requestStatus',
    {
      request: this.props.requestItem,
      role: this.props.role,
      refresh: this.props.refresh,
    });
  }

  render () {
    return(
    <View style={styles.container}>
      <TouchableOpacity onPress={this._onPress.bind(this)}>
        <View style={styles.msgcards}>
          {this.renderRoomPhoto()}
          <View style={styles.textbox}>
            <Text style={styles.housename}>{this.props.requestItem.room.title}</Text>
            {this.renderName()}
          </View>
          {this.renderRequestStatus()}
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
  cardbadgebox: {
    width:16,
    flex:1.5,
  },
  cardbadge:{
    width:10,
    height:10,
    backgroundColor:"#f56e4e",
    borderRadius:50,
    marginTop: 5,
  },
  avatar: {
    flex:5,
    flexDirection:"row-reverse",
    alignItems:"center",
    justifyContent: "center",
    marginLeft:8,
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
    fontFamily: "Vazir-Medium",
    fontSize:18,
    color:'#4f4f4f',
  },
  hostname: {
    fontFamily: "Vazir-Light",
    fontSize:14,
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
});

export default RequestRowScreen;
