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
  Alert,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';

import { productionURL } from './data';


class EditProfile extends Component {
  constructor (props) {
    super(props);
    this.state={
      firstName: null,
      lastName: null,
      cellPhone: null,
      email: null,
      nationalID: null,
      token: null,
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
    if (this.props.user.cell_phone) {
      this.setState({
        cellPhone: this.props.user.cell_phone,
      });
    }
    if (this.props.user.email) {
      this.setState({
        email: this.props.user.email,
      });
    }
    if (this.props.user.national_id) {
      this.setState({
        nationalID: this.props.user.national_id,
      });
    }
    if (this.props.token) {
      this.setState({
        token: this.props.token,
      });
    }
  }

  _onPressSave () {
    fetch(productionURL + '/auth/api/user/edit/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        cell_phone: this.state.cellPhone,
        email: this.state.email,
        national_id: this.state.nationalID,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      this.onLoginFail('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.successful != false) {
        CacheStore.set('user', body.user);
        this.exitSuccessfully();
      } else {
        for (var i = 0; i < body.errors.length; i++) {
          if (body.errors[i] === 'exist_email') {
            this.setState({
              email: this.props.user.email,
            });
            Alert.alert('اطلاعات شما دارای مشکل می‌باشد.');
          } else if (body.errors[i] === 'invalid_email') {
            this.setState({
              email: this.props.user.email,
            });
            Alert.alert('ایمیل شما معتبر نمی‌باشد.');
          } else if (body.errors[i] === 'cell_phone') {
            this.setState({
              cellPhone: this.props.user.cell_phone,
            });
            Alert.alert('اطلاعات شما دارای مشکل می‌باشد.');
          } else if (body.errors[i] === 'exist_national_id') {
            this.setState({
              nationalID: this.props.user.national_id,
            });
            Alert.alert('اطلاعات شما دارای مشکل می‌باشد.');
          } else if (body.errors[i] === 'invalid_national_id') {
            this.setState({
              nationalID: this.props.user.national_id,
            });
            Alert.alert('شماره ملی شما معتبر نمی‌باشد.');
          } else {
            Alert.alert('ذخیره تغییرات با مشکل مواجه شده است.');
          }
        }
      }
    } else {
      Alert.alert('ذخیره تغییرات با مشکل مواجه شده است.');
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

  _onChangeCellPhone (cellPhone) {
    this.setState({
      cellPhone
    });
  }

  _onChangeNationalID (nationalID) {
    this.setState({
      nationalID
    });
  }

  exitSuccessfully () {
    this.props.hideEditProfile();
  }

  render () {
    return (
      <View>
        <View style={styles.header0}>
          <View style={styles.header00}>
            <TouchableOpacity onPress={() => {
              this.props.hideEditProfile();
            }}>
                <Icon size={28} color="#3e3e3e" name="arrow-forward" />
            </TouchableOpacity>
            <Text style={styles.h01}>ویرایش حساب کابری</Text>
            <View style={{width:28}}></View>
          </View>
        </View>
        <KeyboardAwareScrollView>
        <View style={styles.container0}>
          <View style={styles.profilepic}>
            <Icon size={120} color='#c2c2c2' name='account-circle' />
            <TouchableOpacity>
              <Text style={styles.editpic}></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container1}>
          <InputScrollView>
            <Text style={styles.upfield}>نام</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: رضا"
                placeholderTextColor="#acacac"
                maxLength = {20}
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
            <Text style={styles.upfield}>موبایل</Text>
              <TextInput
                style={styles.textInput}
                placeholder="09XXXXXXXXX"
                placeholderTextColor="#acacac"
                maxLength = {11}
                keyboardType = 'phone-pad'
                value={this.state.cellPhone}
                onChangeText={this._onChangeCellPhone.bind(this)}
                underlineColorAndroid={'transparent'} />
            <Text style={styles.upfield}>ایمیل</Text>
              <TextInput
                style={styles.textInput}
                placeholder="وارد کردن آدرس ایمیل"
                placeholderTextColor="#acacac"
                maxLength = {50}
                keyboardType = 'email-address'
                value={this.state.email}
                onChangeText={this._onChangeEmail.bind(this)}
                underlineColorAndroid={'transparent'} />
            <Text style={styles.upfield}>شماره ملی</Text>
              <TextInput
                style={styles.textInput}
                placeholder="وارد کردن شماره ملی"
                placeholderTextColor="#acacac"
                maxLength = {10}
                keyboardType = 'numeric'
                value={this.state.nationalID}
                onChangeText={this._onChangeNationalID.bind(this)}
                underlineColorAndroid={'transparent'} />
            </InputScrollView>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    marginTop:45,
    marginBottom:45,
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
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color:'#4f4f4f',
  },
  profilepic: {
    alignItems:'center',
  },
  textInput: {
    height: 48,
    width:Dimensions.get('window').width-50 ,
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'right',
    color: '#4f4f4f',
    marginBottom:12,
    borderBottomWidth: 2,
    borderBottomColor:'#acacac',
  },
  upfield: {
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
});

export default EditProfile;
