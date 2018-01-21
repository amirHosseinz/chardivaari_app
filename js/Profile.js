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
import AboutUs from './AboutUs';

import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import { productionURL, GATrackerId } from './data';
import EditProfile from './EditProfile';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: {},
      token: null,
      callCenter: null,
      editProfileModalVisible: false,
      aboutUsModalVisible: false,
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
        CacheStore.set('openEditProfile', false);
        this._onEditProfilePress();
      }
    });
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

  _onEditProfilePress () {
    this.setState({
      editProfileModalVisible: true,
    });
  }

  hideEditProfile = () => {
    this.setState({
      editProfileModalVisible: false,
    }, () => {
      this.fetchUser();
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
              <View style={styles.itemiconcircleh2g}>
                <Icon size={23} color="white" name="swap-vert" />
              </View>
            <Text style={styles.profileitemtexth2g}>ورود به پنل میزبان</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider}>
        </View>
        </View>
      );
    } else if (this.props.role === 'host') {
      return(
        <View style={styles.innerContainer}>
        <TouchableOpacity onPress={this._onChangeToGuest.bind(this)}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircleh2g}>
                <Icon size={23} color="white" name="swap-vert" />
              </View>
            <Text style={styles.profileitemtexth2g}>ورود به پنل مهمان</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderLoginOption () {
    if (this.state.user.username === 'GUEST_USER') {
      return(
        <TouchableOpacity onPress={this.onLoginOptionPress}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Icon size={18} color="white" name="exit-to-app" />
              </View>
            <Text style={styles.profileitemtext}>ورود یا عضویت</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity onPress={this._onExitPress}>
          <View style={styles.profileitembox}>
              <View style={styles.itemiconcircle}>
                <Icon size={18} color="white" name="exit-to-app" />
              </View>
            <Text style={styles.profileitemtext}>خروج از حساب کاربری</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderAddListing() {
    // TODO
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
          <Text style={styles.editprofile}>ویرایش حساب کاربری</Text>
        </TouchableOpacity>
      );
    }
  }

  render () {
    return(
      <ScrollView style={styles.container0}>
      <View style={{alignItems:'center'}}>
        <View style={styles.container1}>
          <View style={styles.profilebox}>
            {this.renderProfilePicture()}
            <View style={styles.profileboxtext}>
              <Text style={styles.usertext}>
                {this.state.user.first_name} {this.state.user.last_name}
              </Text>
              {this.renderEditProfileOption()}
            </View>
          </View>
          <TouchableOpacity onPress={() => {
            this.openAboutUs();
          }}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Image source={require('./img/info.png')}
                  style={styles.infopng}/>
                </View>
              <Text style={styles.profileitemtext}>درباره ما</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}>
          </View>
          <TouchableOpacity onPress={() => {
            this.openTermconditions();
          }}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                <Icon size={18} color="white" name="subject" />
                </View>
              <Text style={styles.profileitemtext}>شرایط و قوانین استفاده</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}>
          </View>

          <TouchableOpacity onPress={this._onCallUsPress.bind(this)}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Icon size={18} color="white" name="mail-outline" />
                </View>
              <Text style={styles.profileitemtext}>تماس با ما</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}>
          </View>

          {this.renderChangeSide()}

          {this.renderAddListing()}

          {this.renderLoginOption()}
        </View>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.editProfileModalVisible}
        onRequestClose={() => {
          this.hideEditProfile();
        }}>
         <EditProfile
          hideEditProfile={this.hideEditProfile}
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
    width:Dimensions.get('screen').width-50 ,
    alignItems: 'flex-end',
  },
  profilepicture: {
    width: 90,
    height: 90,
    borderRadius:45,
  },
  profilebox:{
    flexDirection:'row-reverse',
    alignItems: "flex-start",
    marginTop:36,
    marginBottom:28,
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
    color:'#4f4f4f',
    ...Platform.select({
      android: {
        width:Dimensions.get('window').width*(2/3)-30,
      },
    }),
  },
  editprofile:{
    fontSize: 13,
    fontFamily:'IRANSansMobileFaNum',
    color:'#0ca6c0',
  },
  divider:{
    height: 1,
    width:Dimensions.get('window').width-50 ,
    backgroundColor: '#d7d7d7',
    marginTop: 16,
    marginBottom: 16,
  },
  profileitembox:{
    flexDirection:'row-reverse',
    justifyContent:'center',
  },
  profileitemtext:{
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum',
    color:'#4f4f4f',
    marginRight:10,
    marginTop:0,

  },
  itemiconcircle:{
    flexDirection:'row-reverse',
    justifyContent:'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor:'#9e9e9e',
    alignItems:'center',
  },
  itemiconcircleh2g:{
    flexDirection:'row-reverse',
    justifyContent:'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor:'#f56e4e',
    alignItems:'center',
  },
  profileitemtexth2g:{
    fontSize: 18,
    fontFamily:'IRANSansMobileFaNum',
    color:'#f56e4e',
    marginRight:10,
    marginTop:4,
  },
  infopng:{
    height:16,
    resizeMode:'contain',
  },
  innerContainer: {
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
});

export default Profile;
