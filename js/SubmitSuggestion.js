import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  InteractionManager,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';

import { productionURL } from './data';


class SubmitSuggestion extends Component {
  constructor (props) {
    super(props);
    this.state={
      name: null,
      email: null,
      token: null,
      user: null,
      description: null,
    };
  }

  componentWillMount () {
    this.initiate();
  }

  initiate () {
    var name = null;
    if (this.props.user.first_name) {
      name = this.props.user.first_name;
    }
    if (this.props.user.last_name) {
      if (name) {
        name = name + ' ' + this.props.user.last_name;
      } else {
        name = this.props.user.last_name;
      }
    }
    if (name) {
      this.setState({
        name: name,
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

  _onChangeName (name) {
    this.setState({
      name
    });
  }

  _onChangeEmail (email) {
    this.setState({
      email
    });
  }

  _onChangeDescription (desc) {
    this.setState({
      description: desc,
    });
  }

  exitSuccessfully () {
    this.props.hideSuggestionModal();
  }

  _onPressSend () {
    if (this.state.name == null || this.state.name === '' ||
        this.state.description == null || this.state.description === ''
    ) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          Alert.alert('وارد کردن نام و نظر الزامی است.');
        });
      });
    } else {
      fetch(productionURL + '/api/suggestion-submit/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          name: this.state.name,
          subject: 'app feedback - OS: ' + Platform.OS + ' - version: ' + DeviceInfo.getVersion(),
          description: this.state.description,
          email: this.state.email,
        }),
      })
      .then((response) => this.onResponseRecieved(response))
      .catch((error) => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
          });
        });
      });
    }
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (body.is_successful === true) {
        this.exitSuccessfully();
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            Alert.alert('نظر شما با موفقیت ثبت شد.');
          });
        });
      } else {
        if (body.errors && body.errors.indexOf('name') > -1) {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              Alert.alert('وارد کردن نام الزامی است.');
            });
          });
        }
        else if (body.errors && body.errors.indexOf('email') > -1) {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              Alert.alert('ایمیل وارد شده معتبر نیست.');
            });
          });
        }
        else if (body.errors && body.errors.indexOf('description') > -1) {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              Alert.alert('ورود نظر الزامی است.');
            });
          });
        }
      }
    } else {
      // TODO
      // an error handler
    }
  }

  render () {
    return (
      <View style={styles.container0}>

        <View style={styles.header1}>
          <View style={styles.header2}>
            <TouchableOpacity onPress={() => {
              this.exitSuccessfully();
            }}>
                <Icon size={28} color="#3e3e3e" name="arrow-forward" />
            </TouchableOpacity>
            <Text style={styles.h01}>
               انتقاد و پیشنهاد
            </Text>
            <View style={{width:28}}></View>
          </View>
        </View>

        <ScrollView style={styles.container1}>
        <View style={styles.container2}>
        <KeyboardAvoidingView behavior='padding' style={styles.container3}>

            <View style={styles.textContainer}>
              <Text style={styles.textStyle}>
                اولویت اصلی تریپین
                رضایت کاربران آن می‌باشد.
                چنانچه درباره این اپلیکیشن
                نظر،
                نقد یا
                پیشنهادی دارید
                با ما در میان بگذارید
                تا در اولین فرصت آن را
                پیگیری کنیم.
              </Text>
            </View>

            <View style={styles.inputItemBox}>
              <Text style={styles.inputDescriptionStyle}>
                نام و نام‌خانوادگی
              </Text>
              <TextInput
                style={styles.inputTextinputStyle}
                underlineColorAndroid={'#fff'}
                onChangeText={(text) => this._onChangeName(text)}
                value={this.state.name}
                maxLength={100}
              />
            </View>

            <View style={styles.inputItemBox}>
              <Text style={styles.inputDescriptionStyle}>
                ایمیل (اختیاری)
              </Text>
              <TextInput
                style={styles.inputTextinputStyle}
                placeholder={'example@email.com'}
                underlineColorAndroid={'#fff'}
                onChangeText={(text) => this._onChangeEmail(text)}
                value={this.state.email}
              />
            </View>

            <View style={styles.inputItemBox}>
            <Text style={styles.inputDescriptionStyle}>
              متن نظر
            </Text>
              <TextInput
                style={styles.inputTextinputDescriptionStyle}
                multiline={true}
                editable={true}
                placeholder={'...'}
                underlineColorAndroid={'#fff'}
                onChangeText={(text) => this._onChangeDescription(text)}
                value={this.state.description}
              />
            </View>

            <View style={styles.inputItemBox}>
            </View>

          </KeyboardAvoidingView>
          
          <View style={{marginTop: 20,}}>
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
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container1: {
    flex: 1,
  },
  container2: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container3: {
    flex: 1,
    width: Dimensions.get('window').width * 3/4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily: "IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 12,
    paddingLeft: 12,
    marginBottom: 5,
  },
  buttontouch: {
    borderColor: "#22c8d4",
    borderRadius: 50,
    borderWidth: 2,
    height: 48,
    width: 148,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  buttonview: {
    backgroundColor: "#22c8d4",
    borderRadius: 50,
    height: 40,
    width: 140,
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: "row-reverse",
  },
  header1:{
    backgroundColor:'#ffffff',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      android: {
      },
    }),
  },
  header2:{
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        marginTop:14,
      },
      android: {
      },
    }),
  },
  h01: {
    fontSize: 16,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: "#3e3e3e",
  },
  textContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginTop: 15,
    marginBottom: 15,
  },
  textStyle: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontSize: 17,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#3e3e3e",
  },
  inputItemBox: {
    width: Dimensions.get('window').width * 3/4,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 15,
  },
  inputDescriptionStyle: {
    marginBottom: 5,
    textAlign: 'right',
    fontSize: 14,
    fontFamily:'IRANSansMobileFaNum',
    color:"#3e3e3e",
  },
  inputTextinputStyle: {
    height: 40,
    width: Dimensions.get('window').width * 3/4,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 7,
    textAlign: 'right',
    fontSize: 14,
    padding: 8,
    fontFamily:'IRANSansMobileFaNum-Light',
  },
  inputTextinputDescriptionStyle: {
    height: 150,
    width: Dimensions.get('window').width * 3/4,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 7,
    padding: 8,
    textAlignVertical: 'top',
    textAlign: 'right',
    fontSize: 14,
    fontFamily:'IRANSansMobileFaNum-Light',
  },
});

export default SubmitSuggestion;
