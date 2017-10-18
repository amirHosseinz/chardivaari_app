import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

class LoginGetName extends Component {

    render () {
      return(
        <View style={styles.container}>
          <View style={styles.upside}>
              <Text style={styles.addphonenumber}> مشخصات خود را وارد نمایید: </Text>

              <View style={styles.container1}>
                <Text style={styles.upfield}>نام</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="مثال: رضا"
                    placeholderTextColor="#acacac"
                    maxLength = {20 }
                    underlineColorAndroid={'transparent'}

                    />
                <Text style={styles.upfield}>نام خانوادگی</Text>
                    <TextInput
                    style={styles.textInput}
                    placeholder="مثال: رضایی"
                    placeholderTextColor="#acacac"
                    maxLength = {30 }
                    underlineColorAndroid={'transparent'}
                    />
                </View>
            </View>
          <View style={styles.downside}>
            <TouchableOpacity style={styles.buttontouch}>
            <View style={styles.buttonview}>
            <Text style={styles.reservebuttontext}>ثبت</Text>
            </View>
            </TouchableOpacity>
          </View>


        </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: Dimensions.get('window').width,
   height: Dimensions.get('window').height,
  },
   textInput: {
      height: 52,
      width:Dimensions.get('window').width-50 ,
      fontSize: 18,
      fontFamily: 'Vazir',
      textAlign: 'right',
      color: '#4f4f4f',
      marginBottom:12,
      borderBottomWidth: 2,
      borderBottomColor:'#acacac',
    },
    upfield: {
      fontFamily:'Vazir-Light',
      fontSize: 14,
      color:'#c2c2c2',
    },
    reservebuttontext: {
      fontSize: 20,
      fontFamily:"Vazir-Medium",
      color: "#ffffff",
      paddingTop:4,
      paddingBottom:4,
      paddingRight:12,
      paddingLeft:12,
      marginBottom:5,

    },
    buttontouch: {
      borderColor:"#00cecc",
      borderRadius: 50,
      borderWidth : 2,
      height:48,
      width: 148,
      justifyContent:"center",
      alignItems:"center",
        marginBottom:15,
        marginTop:15,


    },
    buttonview: {
      backgroundColor:"#00cecc",
      borderRadius: 50,
        height:40,
        width: 140,
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "row-reverse",
    },
    logo:{
      height:140,
      width:100,
    },
    addphonenumber:{
      fontFamily:'Vazir-Medium',
      fontSize:18,
      marginTop:40,
      marginBottom:10,
      color:'#3e3e3e',
    },
    notnow:{
      fontFamily:'Vazir-Medium',
      fontSize:16,
      color:'#00a8a6',
      marginBottom:10,
    },
    logobox:{
      marginTop:50,
    },
    resendtext:{
      width:Dimensions.get('window').width*2/3 ,
      textAlign:'center',
      fontSize:16,
      fontFamily:'Vazir-Light',
    },
    resendtext1:{
      width:Dimensions.get('window').width*2/3 ,
      textAlign:'center',
      fontSize:16,
      fontFamily:'Vazir-Medium',
    },
    sendcodeplz:{
      marginTop:20,
      marginBottom:20,
    },
    Login1:{
      flexDirection:'column-reverse',
    },
upside:{
  alignItems:'center',
  flex:4,
  marginTop:0,
},
downside:{
  flex:1,
  marginTop:0,
}
  });

export default LoginGetName;
