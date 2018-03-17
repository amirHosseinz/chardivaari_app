import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  AppRegistry,
  TextInput,
  Alert,
  Platform,
  InteractionManager,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';

import { productionURL } from './data';


class SubmitSuggestion extends Component {
  constructor (props) {
    super(props);
    this.state={
      firstName: null,
      lastName: null,
      email: null,
      token: null,
      user: null,
    };
  }

  componentWillMount () {
    if (this.props.user.first_name) {
      this.setState({
        firstName: this.props.user.first_name,
      });
    }
    if (this.props.user.last_name) {
      this.setState({
        lastName: this.props.user.last_name,
      });
    }
    if (this.props.user.email) {
      this.setState({
        email: this.props.user.email,
      });
    }
    if (this.props.token) {
      this.setState({
        token: this.props.token,
      });
    }
    if (this.props.user) {
      this.setState({
        user: this.props.user,
      });
    }
  }

  _onChangeFirstName (firstName) {
    this.setState({
      firstName
    });
  }

  _onChangeLastName (lastName) {
    this.setState({
      lastName
    });
  }

  _onChangeEmail (email) {
    this.setState({
      email
    });
  }

  exitSuccessfully () {
    this.props.hideSuggestionModal();
  }

  _onPressSend () {
    // TODO
  }

  render () {
    return (
      <View style={{flex: 1}}>

        <View style={styles.header0}>
          <View style={styles.header00}>
            <TouchableOpacity onPress={() => {
              this.exitSuccessfully();
            }}>
                <Icon size={28} color="#3e3e3e" name="arrow-forward" />
            </TouchableOpacity>
            <Text style={styles.h01}>
              انتقادات
            </Text>
            <View style={{width:28}}></View>
          </View>
        </View>

        <View style={styles.container0}>

          <View style={styles.profilepic}>
          </View>

          <View style={styles.container1}>

            <Text style={styles.upfield}>نام</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: رضا"
                placeholderTextColor="#acacac"
                maxLength={20}
                value={this.state.firstName}
                onChangeText={this._onChangeFirstName.bind(this)}
                underlineColorAndroid={'transparent'} />

            <Text style={styles.upfield}>نام خانوادگی</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: رضایی"
                placeholderTextColor="#acacac"
                maxLength = {30}
                value={this.state.lastName}
                onChangeText={this._onChangeLastName.bind(this)}
                underlineColorAndroid={'transparent'} />

            <Text style={styles.upfield}>ایمیل</Text>
              <TextInput
                style={styles.textInput}
                placeholder="وارد کردن آدرس ایمیل"
                placeholderTextColor="#acacac"
                maxLength={50}
                keyboardType='email-address'
                value={this.state.email}
                onChangeText={this._onChangeEmail.bind(this)}
                underlineColorAndroid={'transparent'} />

          </View>

          <View style={styles.profilepic}>
              <TouchableOpacity
                style={styles.buttontouch}
                onPress={this._onPressSend.bind(this)}>
              <View style={styles.buttonview}>
              <Text style={styles.reservebuttontext}>
                ارسال نظر
              </Text>
              </View>
              </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('window').width-80,
    alignItems: 'flex-end',
    marginTop:5,
    marginBottom:30,
  },
  editpic: {
    fontSize: 14,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color:'#22c8d4',
  },
  profilepic: {
    alignItems:'center',
  },
  textInput: {
    height: 44,
    width:Dimensions.get('window').width-80,
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'right',
    color: '#4f4f4f',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  upfield: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize: 14,
    color:'#c2c2c2',
    marginTop:11,
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#22c8d4",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 148,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:25,
  },
  buttonview: {
    backgroundColor:"#22c8d4",
    borderRadius: 50,
    height:40,
    width: 140,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  header0:{
    backgroundColor:'#ffffff',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:3,
  },
  header00:{
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:3,
  },
  h01:{
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#3e3e3e",
  },
  profilepicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default SubmitSuggestion;
