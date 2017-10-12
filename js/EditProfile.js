import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  AppRegistry,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class EditProfile extends Component {

  _onPressSave () {
    // TODO
    // send information to server and save
    this.props.hideEditProfile();
  }

  render () {
    return (
      <KeyboardAwareScrollView>

      <View style={styles.container0}>
        <View style={styles.profilepic}>
          <Icon size={120} color='#c2c2c2' name='account-circle' />
          <TouchableOpacity>
            <Text style={styles.editpic}>انتخاب تصویر</Text>
          </TouchableOpacity>
        </View>
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
              <Text style={styles.upfield}>موبایل</Text>
                  <TextInput
                  style={styles.textInput}
                  placeholder="09XXXXXXXXX"
                  placeholderTextColor="#acacac"
                  maxLength = {11}
                  keyboardType = 'phone-pad'
                  underlineColorAndroid={'transparent'}

                  />
                  <Text style={styles.upfield}>ایمیل</Text>
                      <TextInput
                      style={styles.textInput}
                      placeholder="وارد کردن آدرس ایمیل"
                      placeholderTextColor="#acacac"
                      maxLength = {30}
                      keyboardType = 'email-address'
                      underlineColorAndroid={'transparent'}

                      />


        </View>
        <View style={styles.profilepic}>
            <TouchableOpacity
              style={styles.buttontouch}
              onPress={this._onPressSave.bind(this)}>
            <View style={styles.buttonview}>
            <Text style={styles.reservebuttontext}>ذخیره</Text>
            </View>
            </TouchableOpacity>
        </View>
      </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    marginTop:45,
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('window').width-50 ,
    alignItems: 'flex-end',
    marginTop:5,
    marginBottom:30,
  },
  editpic: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
    color:'#4f4f4f',
  },
  profilepic: {
    alignItems:'center',
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
    marginBottom:25,
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
});

export default EditProfile;
