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

class Request extends Component {
  render () {
    return(
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.msgcards}>

          <View style={styles.avatar}>
            <Image source={require('./Images/homesample.jpg')}
            style={styles.avatarimg}/>
          </View>
          <View style={styles.textbox}>
            <Text style={styles.housename}>ویلای لوکس در ساحل...</Text>
            <Text style={styles.hostname}>فرهاد براهیمی</Text>
          </View>
          <View style={styles.iconbox}>
            <View style={styles.iconboox}>
            <Image source={require('./Images/waiting4pay.png')}
            style={styles.iconimg}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.msgcards}>

          <View style={styles.avatar}>
            <Image source={require('./Images/homesample.jpg')}
            style={styles.avatarimg}/>
          </View>
          <View style={styles.textbox}>
            <Text style={styles.housename}>ویلای لوکس در ساحل...</Text>
            <Text style={styles.hostname}>فرهاد براهیمی</Text>
          </View>
          <View style={styles.iconbox}>
            <View style={styles.iconboox}>
            <Image source={require('./Images/waiting4accept.png')}
            style={styles.iconimg}/>
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
}
});


export default Request;
