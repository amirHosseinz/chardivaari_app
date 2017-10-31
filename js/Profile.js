import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  StatusBar,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import { NavigationActions } from 'react-navigation';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';
import EditProfile from './EditProfile';

class Profile extends Component {
  constructor (props) {
    super(props);
    this.state={
      user: {},
      token: null,
      editProfileModalVisible: false,
    };
  }

  componentWillMount () {
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
      });
      CacheStore.set('user', body.user);
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

  _onExitPress () {
    CacheStore.flush();
    this.resetNavigation('login');
  }

  _onCallUsPress () {
    Communications.phonecall('09124642386', true);
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
                <Icon size={27} color="white" name="swap-vert" />
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
                <Icon size={27} color="white" name="swap-vert" />
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
          size={100}
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
      <View style={styles.container0}>
      <StatusBar
        backgroundColor="#d7d7d7"
        barStyle="dark-content"
      />
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

          <TouchableOpacity>
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

          <TouchableOpacity onPress={this._onCallUsPress.bind(this)}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Icon size={24} color="white" name="mail-outline" />
                </View>
              <Text style={styles.profileitemtext}>تماس با ما</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}>
          </View>

          {this.renderChangeSide()}

          {this.renderAddListing()}

          <TouchableOpacity onPress={this._onExitPress.bind(this)}>
            <View style={styles.profileitembox}>
                <View style={styles.itemiconcircle}>
                  <Icon size={24} color="white" name="exit-to-app" />
                </View>
              <Text style={styles.profileitemtext}>خروج</Text>
            </View>
          </TouchableOpacity>

        </View>

        <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.editProfileModalVisible}
        onRequestClose={() => {
          this.hideEditProfile();
        }}
        >
         <EditProfile
          hideEditProfile={this.hideEditProfile}
          user={this.state.user}
          token={this.state.token}
         />
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container0: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#ededed',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width:Dimensions.get('screen').width-50 ,
    alignItems: 'flex-end',
  },
  profilepicture: {
    width: 100,
    height: 100,
    borderRadius:100,
  },
  profilebox:{
    flexDirection:'row-reverse',
    marginTop:60,
    marginBottom:50,
  },
  profileboxtext:{
    marginRight:20,
  },
  usertext:{
    fontSize: 26,
    fontFamily:'Vazir-Medium',
    color:'#4f4f4f',
    width:Dimensions.get('window').width*(2/3)-30 ,
    marginTop:5,


  },
  editprofile:{
    fontSize: 16,
    fontFamily:'Vazir',
    color:'#22c8d4',
  },
  divider:{
    height: 2,
    width:Dimensions.get('window').width-50 ,
    backgroundColor: '#d7d7d7',
    marginTop: 20,
    marginBottom: 20,
  },
  profileitembox:{
    flexDirection:'row-reverse',
    justifyContent:'center',
  },
  profileitemtext:{
    fontSize: 19,
    fontFamily:'Vazir',
    color:'#4f4f4f',
    marginRight:10,
    marginTop:0,

  },
  itemiconcircle:{
    flexDirection:'row-reverse',
    justifyContent:'center',
    height: 38,
    width: 38,
    borderRadius: 44,
    backgroundColor:'#9e9e9e',
    alignItems:'center',
  },
  itemiconcircleh2g:{
    flexDirection:'row-reverse',
    justifyContent:'center',
    height: 38,
    width: 38,
    borderRadius: 44,
    backgroundColor:'#f56e4e',
    alignItems:'center',
  },
  profileitemtexth2g:{
    fontSize: 19,
    fontFamily:'Vazir',
    color:'#f56e4e',
    marginRight:10,
    marginTop:4,
  },
  infopng:{
    height:18,
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
