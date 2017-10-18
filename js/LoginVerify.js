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

class LoginVerify extends Component {

    render () {
      return(
        <View style={styles.container}>
          <View style={styles.upside}>
              <Text style={styles.addphonenumber}> کد تایید را وارد نمایید: </Text>

              <TextInput
              style={styles.textInput}
              placeholder="O O O O"
              placeholderTextColor="#acacac"
              maxLength = {4}
              keyboardType = 'numeric'
              underlineColorAndroid={'transparent'}
              />
              <View style={styles.sendcodeplz}>
                  <Text style={styles.resendtext}>یک کد 4 رقمی به شماره </Text>
                  <Text style={styles.resendtext1}>09377733194</Text>
                  <Text style={styles.resendtext}>ارسال شد. لطفا آن را وارد کنید.</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.notnow}>دریافت مجدد کد</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.notnow}>شماره را اشتباه وارد کرده اید؟</Text>
              </TouchableOpacity>
            </View>
          <View style={styles.downside}>
            <TouchableOpacity style={styles.buttontouch}>
            <View style={styles.buttonview}>
            <Text style={styles.reservebuttontext}>ارسال</Text>
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
      width:Dimensions.get('window').width/4 ,
      fontSize: 18,
      fontFamily: 'Vazir',
      textAlign: 'center',
      color: '#4f4f4f',
      marginBottom:5,
      borderBottomWidth: 2,
      borderBottomColor:'#acacac',
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
      marginBottom:0,
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
  marginTop:20,
}
  });

  export default LoginVerify;
