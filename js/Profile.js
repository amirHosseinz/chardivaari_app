import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { productionURL, GATrackerId } from './data';
import AboutUs from './AboutUs';
import EditProfile from './EditProfile';
import SubmitSuggestion from './SubmitSuggestion';
import {
  renderPriceNumberCommaBetween,
} from './tools/renderPriceNumber';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: {},
      token: null,
      callCenter: null,
      editProfileModalVisible: false,
      aboutUsModalVisible: false,
      submitSuggestionModalVisible: false,
      loginModalVisible: false,
    };
  }

  componentWillMount () {
    let tracker = new GoogleAnalyticsTracker(GATrackerId);
    tracker.trackScreenView('Profile');
    CacheStore.get('user').then((userData) => {
      if (userData == null) {
        // TODO
      } else {
        this.setState({
          user: userData,
        });
      }
    });
    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('call_center').then((value) => {
      if (value != null) {
        this.setState({
          callCenter: value,
        });
      }
    });
    CacheStore.get('openEditProfile').then((value) => {
      if (value === true) {
        this._onEditProfilePress();
      }
    });
  }

  backNavigation = () => {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  setToken (token) {
    this.setState({
      token
    }, () => this.fetchUser());
  }

  fetchUser () {
    fetch(productionURL + '/auth/api/user/profile/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      // network error
      Alert.alert('لطفا پس از اطمینان اتصال اینترنت مجددا تلاش نمایید.');
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        user: body.user,
        callCenter: body.call_center,
      });
      CacheStore.set('user', body.user);
      CacheStore.set('call_center', body.call_center);
    } else {
      // TODO
      // invalid token error
      // user not logged in
    }
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

  _onExitPress = () => {
    Alert.alert(
      'درخواست خروج',
      'از حساب کاربری خود خارج می‌شوید؟',
      [
        {text: 'بله', onPress: () => {
          this.onLoginOptionPress();
        },},
        {text: 'خیر', onPress: () => {},},
      ],
      { cancelable: false }
    );
  }

  onLoginOptionPress = () => {
    CacheStore.flush();
    this.resetNavigation('login');
  }

  _onCallUsPress () {
    // 02188573037
    Communications.phonecall(this.state.callCenter, true);
  }

  _onWalletPress () {
    this.props.navigation.navigate('wallet', {token: this.state.token});
  }

  _onInvitePress () {
    this.props.navigation.navigate('inviteFriend');
  }

  _onEditProfilePress () {
    this.setState({
      editProfileModalVisible: true,
    });
  }

  _onSubminSuggestionPress () {
    this.setState({
      submitSuggestionModalVisible: true,
    });
  }

  hideEditProfile = (cell_phone) => {
    this.setState({
      editProfileModalVisible: false,
    }, () => {
      if (this.state.user.cell_phone != cell_phone){
        CacheStore.flush();
        this.resetNavigation('login');
        /*this.props.navigation.navigate('loginVerify', {
          cellPhoneNo: this.state.user.cell_phone,
          smsCenter: '',
          hasAccount: true,
          installReferralCode: '',
        });*/
      }else{
        this.fetchUser();
      }
    });
    CacheStore.get('openEditProfile').then((value) => {
      if (value === true) {
        CacheStore.set('openEditProfile', false);
        this.backNavigation();
      }
    });
  }

  hideSuggestionModal = () => {
    this.setState({
      submitSuggestionModalVisible: false
    });
  }

  openAboutUs = () => {
    this.setState({
      aboutUsModalVisible: true,
    });
  }

  closeAboutUs = () => {
    this.setState({
      aboutUsModalVisible: false,
    });
  }

  openTermconditions = () => {
    Linking.openURL('http://www.tripinn.ir/terms&conditions').catch(err => console.log('An error occurred', err));
  }

  openLoginModal = () => {
    this.setState({
      loginModalVisible: true,
    });
  }

  closeLoginModal = () => {
    this.setState({
      loginModalVisible: false,
    });
  }

  _onChangeToHost () {
    this.props.navigation.navigate('hostScreen', {token: this.state.token});
  }

  _onChangeToGuest () {
    this.props.navigation.navigate('guestScreen', {token: this.state.token});
  }

  renderChangeSide () {
    if (this.state.user.allowed_host && this.props.role === 'guest') {
      return(
        <View style={styles.innerContainer}>
        <TouchableOpacity onPress={this._onChangeToHost.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/host_side.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>ورود به پنل میزبان</Text>
          </View>
        </TouchableOpacity>
        </View>
      );
    } else if (this.props.role === 'host') {
      return(
        <View style={styles.innerContainer}>
        <TouchableOpacity onPress={this._onChangeToGuest.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/host_side.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>ورود به پنل مهمان</Text>
          </View>
        </TouchableOpacity>
        </View>
      );
    }
  }

  renderLogoutOption () {
    if (this.state.user.username === 'GUEST_USER') {
    } else {
      return(
        <TouchableOpacity onPress={this._onExitPress}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/logout.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>خروج از حساب کاربری</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderProfilePicture () {
    if (this.state.user.profile_picture != null) {
      return(
        <Image source={{
          uri: productionURL + this.state.user.profile_picture,
        }}
         style={styles.profilepicture}/>
      );
    } else {
      return(
        <Icon
          name='account-circle'
          size={90}
          color='#c2c2c2'
          style={styles.profilepicture}
        />
      );
    }
  }

  renderEditProfileOption () {
    if (this.state.user.username != 'GUEST_USER') {
      return(
        <TouchableOpacity onPress={this._onEditProfilePress.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/edit_profile.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              ویرایش مشخصات
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity onPress={this.openLoginModal}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/edit_profile_low.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              ویرایش مشخصات
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderWallet () {
    if (this.state.user.username != 'GUEST_USER') {
      return(
        <TouchableOpacity onPress={this._onWalletPress.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/wallet.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              کیف پول
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity onPress={this.openLoginModal}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/wallet_low.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              کیف پول
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderInviteFriend () {
    if (this.state.user.username != 'GUEST_USER') {
      return(
        <TouchableOpacity onPress={this._onInvitePress.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/invite_friend.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              دعوت از دوستان
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity onPress={this.openLoginModal}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/invite_friend_low.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.profileitemtext}>
              دعوت از دوستان
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderLoginOption () {
    if (this.state.user.username != 'GUEST_USER') {
    } else {
      return(
        <TouchableOpacity onPress={this.onLoginOptionPress}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Image source={require('./img/financialAccount/login.png')}
                  style={styles.infopng} />
              </View>
            <Text style={styles.redprofileitemtext}>
              ورود
              /
              عضویت
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderHeader () {
    return(
      <View style={styles.profilebox}>
        {this.renderProfilePicture()}
        <View style={styles.profileboxtext}>
          <Text style={styles.usertext}>
            {this.state.user.first_name} {this.state.user.last_name}
          </Text>
          {this.renderCreditSection()}
        </View>
      </View>
    );
  }

  renderCredit () {
    if (this.state.user){
      sum = 0;
      if(!isNaN(this.state.user.credit)) {
        sum = sum + this.state.user.credit
      }
      if(!isNaN(this.state.user.gift_credit)) {
        sum = sum + this.state.user.gift_credit
      }
    }
      return sum;
  }

  renderCreditSection () {
    if (this.state.user.username != 'GUEST_USER') {
      return(
        <View style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={styles.usertext}>
            اعتبار کیف پول:
          </Text>
          <Text style={[styles.usertext, {marginRight: 10}]}>
            {this.renderCredit()}
          </Text>
          <Text style={[styles.usertext, {marginRight: 10}]}>
            تومان
          </Text>
        </View>
      );
    }
  }

  render () {
    return(
      <ScrollView style={styles.container0}>
      <View style={{alignItems:'center'}}>
        <View style={styles.container1}>

          {this.renderHeader()}

          {this.renderEditProfileOption()}

          {this.renderWallet()}

          {this.renderInviteFriend()}

          {this.renderLoginOption()}

          <View style={styles.divider}>
          </View>

          <TouchableOpacity onPress={() => {
            this.openAboutUs();
          }}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Image source={require('./img/financialAccount/about_us.png')}
                    style={styles.infopng} />
                </View>
              <Text style={styles.profileitemtext}>درباره ما</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.openTermconditions();
          }}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Image source={require('./img/financialAccount/terms.png')}
                    style={styles.infopng} />
                </View>
              <Text style={styles.profileitemtext}>شرایط و قوانین استفاده</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this._onCallUsPress.bind(this)}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Image source={require('./img/financialAccount/contact_us.png')}
                    style={styles.infopng} />
                </View>
              <Text style={styles.profileitemtext}>تماس با ما</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this._onSubminSuggestionPress.bind(this)}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Image source={require('./img/financialAccount/feedback.png')}
                    style={styles.infopng} />
                </View>
              <Text style={styles.profileitemtext}>
                انتقاد و پیشنهاد
              </Text>
            </View>
          </TouchableOpacity>

          {this.renderChangeSide()}

          {this.renderLogoutOption()}
        </View>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.editProfileModalVisible}
        onRequestClose={() => {
          this.hideEditProfile(cellPhone);
        }}>
         <EditProfile
          hideEditProfile={this.hideEditProfile}
          user={this.state.user}
          token={this.state.token} />
        </Modal>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.submitSuggestionModalVisible}
        onRequestClose={() => {
          this.hideSuggestionModal();
        }}>
         <SubmitSuggestion
          hideSuggestionModal={this.hideSuggestionModal}
          user={this.state.user}
          token={this.state.token} />
        </Modal>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.aboutUsModalVisible}
        onRequestClose={() => {
          this.closeAboutUs();
        }}>

        <AboutUs onCloseModal={this.closeAboutUs}>
        </AboutUs>
        </Modal>

        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.loginModalVisible}
          onRequestClose={() => {
            this.closeLoginModal();
          }}>
         <View style={styles.popup}>
         <TouchableOpacity onPress={this.closeLoginModal}>
           <View style={styles.backbuttonview}>
             <Icon size={40} color="#f3f3f3" name="close" />
           </View>
         </TouchableOpacity>
          <View style={styles.popuptextbox}>
            <Text style={styles.popuptext}>
              لطفا وارد
              حساب کاربری
              خود شوید.
            </Text>
              <TouchableOpacity style={styles.buttontouch1} onPress={() => {
                this.onLoginOptionPress();
              }}>
              <View>
              <Text style={styles.reservebuttontext}>ورود</Text>
            </View>
            </TouchableOpacity>
          </View>
         </View>
        </Modal>

      </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    backgroundColor:'#ededed',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('screen').width,
    alignItems: 'flex-end',
  },
  profilepicture: {
    width: 90,
    height: 90,
    borderRadius:45,
  },
  profilebox:{
    flexDirection:'row-reverse',
    width:Dimensions.get('window').width,
    alignItems: 'flex-start',
    backgroundColor: '#0ca6c1',
    marginBottom: 28,
    alignItems:'center',
  },
  profileboxtext:{
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginRight:20,
  },
  usertext:{
    fontSize: 21,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'white',
    textAlign: 'right',
  },
  divider: {
    height: 2,
    width:Dimensions.get('window').width,
    backgroundColor: '#d7d7d7',
    marginTop: 16,
    marginBottom: 16,
  },
  profileitembox: {
    flexDirection:'row-reverse',
    justifyContent:'center',
    margin: 5,
    marginLeft: 10,
  },
  profileitemtext:{
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum',
    color:'#4f4f4f',
    marginRight:10,
    ...Platform.select({
      ios: {
        marginTop:3,
      },
      android: {
      },
    }),
  },
  redprofileitemtext:{
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum',
    color:'#f56e4e',
    marginRight:10,
    marginTop:0,
  },
  itemiconcircle: {
    flexDirection:'row-reverse',
    justifyContent:'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    // backgroundColor:'#9e9e9e',
    alignItems:'center',
  },
  infopng:{
    height: 28,
    width: 28,
    resizeMode:'contain',
  },
  innerContainer: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  popup: {
    backgroundColor:  'rgba(0,0,0,0.82)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  popuptext: {
    color:'white',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:20,
    textAlign:'center',
    width: Dimensions.get('window').width - 50,
    marginTop:180,
    marginBottom:30,
  },
  popuptextbox: {
    alignItems:'center'
  },
  backbuttonview: {
    alignItems:'flex-end',
    marginRight:25,
    marginTop:25,
  },
  buttontouch1: {
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 148,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  reservebuttontext: {
    fontSize: 19,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
});

export default Profile;
