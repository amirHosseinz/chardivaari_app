import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import Termconditions from './Termconditions';
import { GATrackerId, productionURL } from './data';


class LoginGetName extends Component {
  constructor (props) {
    super(props);
    this.state={
      firstName: '',
      lastName: '',
      cellPhoneNo: null,
      verificationCode: null,
      tracker: null,
      is_terms_checked: true,
      termsConditionsModalVisible: false,
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('LoginGetName');
    this.setState({
      firstName: this.props.navigation.state.params.firstName,
      lastName: this.props.navigation.state.params.lastName,
      cellPhoneNo: this.props.navigation.state.params.cellPhoneNo,
      verificationCode: this.props.navigation.state.params.verificationCode,
      tracker: tracker,
    });
  }

  onSubmitButtonPress = () => {
    fetch(productionURL + '/auth/api/signup/set_name/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cell_phone: this.state.cellPhoneNo,
        verification_code: this.state.verificationCode,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      // console.log(error);
      Alert.alert('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
    });
  }

  resetNavigation (targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      CacheStore.set('token', body.token);
      CacheStore.set('username', body.user.username);
      CacheStore.set('user', body.user);
      this.state.tracker.setUser(body.user.username);
      this.resetNavigation('guestScreen');
    } else if (response.status === 400) {
      // unauthorized
    } else {
      // TODO
      // error handle
    }
  }

  openTermsAndConditions = () => {
    this.setState({
      termsConditionsModalVisible: true,
    });
  }

  closeTermsAndConditions = () => {
    this.setState({
      termsConditionsModalVisible: false,
    });
  }

  onCheckedChanged = () => {
    this.setState({
      is_terms_checked: !this.state.is_terms_checked,
    });
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.upside}>
            <Text style={styles.addphonenumber}> مشخصات خود را وارد نمایید: </Text>

            <View style={styles.container1}>
              <Text style={styles.upfield}>نام</Text>
                <TextInput
                  style={styles.textInput}
                  autoFocus={true}
                  placeholder="مثال: رضا"
                  placeholderTextColor="#acacac"
                  value={this.state.firstName}
                  maxLength = {20}
                  onChangeText={firstName => {
                    this.setState({ firstName });
                  }}
                  underlineColorAndroid={'transparent'}
                  />
              <Text style={styles.upfield}>نام خانوادگی</Text>
                  <TextInput
                  style={styles.textInput1}
                  placeholder="مثال: رضایی"
                  placeholderTextColor="#acacac"
                  value={this.state.lastName}
                  maxLength = {30}
                  onChangeText={lastName => {
                    this.setState({ lastName });
                  }}
                  underlineColorAndroid={'transparent'}
                  />
              </View>

              <View
                style={{
                  width: Dimensions.get('window').width-60,
                }}
              >
              <View style={{
                flexDirection: 'row-reverse',
              }}>
                <CheckBox
                  onClick={()=>this.onCheckedChanged()}
                  isChecked={this.state.is_terms_checked}
                  checkBoxColor={'#22c8d4'}
                />
                <Text style={styles.resulttext}>
                قوانین تریپین را مطالعه کرده‌ام و آن‌ها را می‌پذیرم.
                </Text>
              </View>
                <View style={styles.interpersonresult}>
                  <TouchableOpacity onPress={() => {this.openTermsAndConditions();}}>
                    <Text style={styles.resulttext2}>
                    مشاهده‌ی قوانین
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>

        <View style={styles.downside}>
          <TouchableOpacity style={styles.buttontouch}
            onPress={this.onSubmitButtonPress.bind(this)}>
          <View style={styles.buttonview}>
          <Text style={styles.reservebuttontext}>ثبت</Text>
          </View>
          </TouchableOpacity>
        </View>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.termsConditionsModalVisible}
        onRequestClose={() => {
          this.closeTermsAndConditions();
        }}>
          <Termconditions onCloseModal={this.closeTermsAndConditions}>
          </Termconditions>
        </Modal>

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
    height: 48,
    width:Dimensions.get('window').width-50 ,
    fontSize: 14,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'right',
    color: '#4f4f4f',
    marginBottom:12,
    borderBottomWidth: 1.5,
    borderBottomColor:'#acacac',
  },
  textInput1: {
    height: 48,
    width:Dimensions.get('window').width-50 ,
    fontSize: 14,
    fontFamily: 'IRANSansMobileFaNum',
    textAlign: 'right',
    color: '#4f4f4f',
    marginBottom:5,
    borderBottomWidth: 1.5,
    borderBottomColor:'#acacac',
  },
  upfield: {
    fontFamily:'IRANSansMobileFaNum-Light',
    fontSize: 12,
    color:'#c2c2c2',
  },
  reservebuttontext: {
    fontSize: 18,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:4,
  },
  buttontouch: {
    borderColor:"#22c8d4",
    borderRadius: 50,
    borderWidth : 2,
    height:44,
    width: 144,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:25,
    marginTop:10,
  },
  buttonview: {
    backgroundColor:"#22c8d4",
    borderRadius: 50,
    height:36,
    width: 136,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  addphonenumber:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:18,
    marginTop:30,
    marginBottom:10,
    color:'#3e3e3e',
  },
  logobox:{
    marginTop:35,
  },
  resendtext:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Light',
  },
  resendtext1:{
    width:Dimensions.get('window').width*2/3 ,
    textAlign:'center',
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
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
  },
  interpersonresult:{
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  resulttext:{
    textAlign: 'right',
    alignSelf: 'stretch',
    fontFamily: 'IRANSansMobileFaNum-Light',
    fontSize:14,
    color:'#000000',
  },
  resulttext2:{
    fontFamily:"IRANSansMobileFaNum-Medium",
    fontSize:14,
    color:"#f56e4e"
  },
});

export default LoginGetName;
