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


class Login extends Component {
  constructor (props) {
    super(props);
    this.state={
      cellPhoneNo: '',
    };
  }

  skipLogin () {
    // TODO
    console.log('bikhiiil daaash');
  }

  checkPhoneNumberFromServer () {
    console.log('*');
  }

  checkPhoneNumber () {
    if (this.state.cellPhoneNo.length == 11 &&
      this.state.cellPhoneNo.search('09') == 0) {
        Alert.alert(
          'تایید شماره تلفن',
          'آیا شماره‌ی شما' + this.state.cellPhoneNo + 'می‌باشد؟',
          [
            {text: 'بله', onPress: () => {
              this.checkPhoneNumberFromServer();
            },},
            {text: 'خیر', onPress: () => {},},
          ],
          { cancelable: false }
        );
    }
  }

  getConfirmationCode () {
    if (this.state.cellPhoneNo.length < 11) {
      Alert.alert('لطفا شماره همراه خود را کامل وارد نمایید.');
    } else if (this.state.cellPhoneNo.search('09') > 0) {
      Alert.alert('لطفا شماره خود را در قالب گفته شده وارد نمایید.');
    } else {
      Alert.alert(
        'تایید شماره تلفن',
        'آیا شماره‌ی شما' + this.state.cellPhoneNo + 'می‌باشد؟',
        [
          {text: 'بله', onPress: () => {
            this.checkPhoneNumberFromServer();
          },},
          {text: 'خیر', onPress: () => {},},
        ],
        { cancelable: false }
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.logobox}>
        <Image source={require('./img/starBlank.png')}
          style={styles.logo}/>
        </View>
        <Text style={styles.addphonenumber}> لطفا شماره موبایل خود را وارد کنید: </Text>

        <TextInput
          style={styles.textInput}
          placeholder="09XXXXXXXXX"
          placeholderTextColor="#acacac"
          value={this.state.cellPhoneNo}
          maxLength = {11}
          keyboardType = 'phone-pad'
          onChange={() => {this.checkPhoneNumber();}}
          onChangeText={cellPhoneNo => this.setState({ cellPhoneNo })}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={styles.buttontouch} onPress={this.getConfirmationCode.bind(this)}>
          <View style={styles.buttonview}>
            <Text style={styles.reservebuttontext}>دریافت کد ورود</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.skipLogin.bind(this)}>
          <Text style={styles.notnow}>فعلا بیخیال</Text>
        </TouchableOpacity>
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
    textAlign: 'center',
    color: '#4f4f4f',
    marginBottom:12,
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
    width: 188,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:15,
    marginTop:15,
  },
  buttonview: {
    backgroundColor:"#00cecc",
    borderRadius: 50,
    height:40,
    width: 180,
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
    fontSize:16,
    marginTop:30,
    marginBottom:10,
    color:'#3e3e3e',
  },
  notnow:{
    fontFamily:'Vazir-Medium',
    fontSize:16,
    color:'#00a8a6',
  },
  logobox:{
    marginTop:50,
  },
});

export default Login;
