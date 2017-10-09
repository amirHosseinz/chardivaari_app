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

class PrivateMessageRow extends Component {
  render () {
    return(
    <View style={styles.container}>
    <TouchableOpacity>
      <View style={styles.msgcards}>

        <View style={styles.avatar}>
          <Image source={require('./img/account.jpg')}
          style={styles.avatarimg}/>
        </View>
        <View style={styles.textbox}>
          <Text style={styles.housename}>فرهاد براهیمی</Text>
          <Text style={styles.hostname}>ویلای لاکچری کنار ساحل ...</Text>
        </View>
        <View style={styles.badgebox}>
          <View style={styles.badge}>

          </View>
        </View>
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <View style={styles.msgcards}>

        <View style={styles.avatar}>
          <Image source={require('./img/account.jpg')}
          style={styles.avatarimg}/>
        </View>
        <View style={styles.textbox}>
          <Text style={styles.housename}>فرهاد براهیمی</Text>
          <Text style={styles.hostname}>ویلای لاکچری کنار ساحل ...</Text>
        </View>
        <View style={styles.badgebox}>
          <View style={styles.badge}>
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
  fontFamily: "Vazir-Medium",
  fontSize:18,
},
hostname: {
  fontFamily: "Vazir-Light",
  fontSize:14,
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


export default Request;
