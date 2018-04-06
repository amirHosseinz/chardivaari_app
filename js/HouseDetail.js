import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Modal,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Stars from 'react-native-stars';
import Button from 'apsl-react-native-button';
import ImageSlider from 'react-native-image-slider';
import StarRating from 'react-native-star-rating';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Communications from 'react-native-communications';
// import ViewPager from 'react-native-viewpager';
// import KeepAwake from 'react-native-keep-awake';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import ViewPager from './common/custom-viewpager';
import Facilities from './Facilities';
import { productionURL, GATrackerId } from './data';


class HouseDetail extends Component {
  constructor(props) {
   super(props);
   this.state = {
     token: '',
     user: null,
     room: {},
     imagesData: null,
     region: null,
     marker: null,
     loginModalVisible: false,
     contactModalVisible: false,
     facilitiesModalVisible: false,
     nationalIdModalVisible: false,
     callSupportModalVisible: false,
     tracker: null,
     isHost: false,
     callCenter: null,
     isLiked: false,
     inMidLiking: false,
   };
   this.mapStyle = [];
 }

 onRegionChange(region) {
   this.setState({ region });
 }

 componentDidMount () {
   let tracker = new GoogleAnalyticsTracker(GATrackerId);
   tracker.trackScreenView('HouseDetail');
   this.setState({
     tracker: tracker,
   });
   CacheStore.get('token').then((value) => this.setToken(value));
   CacheStore.get('user').then((value) => {
     if (value != null) {
       this.setState({
         user: value,
       });
     }
   });
   CacheStore.get('call_center').then((value) => {
     if (value != null) {
       this.setState({
         callCenter: value,
       });
     }
   });

   if (this.props.navigation.state.params.room) {
     this.setState({
       room: this.props.navigation.state.params.room,
       isLiked: this.props.navigation.state.params.room.is_liked,
     }, () => {
       this.imagesDataFeed();
     });

     var initRegion = {
       latitude: this.props.navigation.state.params.room.latitude,
       longitude: this.props.navigation.state.params.room.longitude,
       latitudeDelta: 0.05,
       longitudeDelta: 0.05,
     };
     this.setState({ region: initRegion });

     var pointCoordinate = {
       latitude: this.props.navigation.state.params.room.latitude,
       longitude: this.props.navigation.state.params.room.longitude,
     };
     var circleElement = {
       latlng: pointCoordinate,
       radius: 350,
     };
     this.setState({ marker: circleElement });
   }
   if (this.props.navigation.state.params.role === 'host') {
     this.setState({
       isHost: true,
     });
   }
 }

 setToken (token) {
   this.setState({
     token
   }, () => {
     if (this.props.navigation.state.params.roomId) {
       this.fetchRoom(this.props.navigation.state.params.roomId);
     } else if (this.props.navigation.state.params.room) {
       this.fetchRoom(this.props.navigation.state.params.room.id);
     }
   });
 }

 fetchRoom (roomId) {
   fetch(productionURL + '/api/get/room/', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Token ' + this.state.token,
     },
     body: JSON.stringify({
       room_id: roomId,
     }),
   })
   .then((response) => this.onGetRoomResponseRecieved(response))
   .catch((error) => {
     Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
   });
 }

 onGetRoomResponseRecieved (response) {
   if (response.status === 200) {
     body = JSON.parse(response._bodyText);
     this.setState({
       room: body.room,
       isLiked: body.room.is_liked,
     },() => {
       this.setMapInitials();
       this.imagesDataFeed();
     });
   }
 }

 setMapInitials () {
   var initRegion = {
     latitude: this.state.room.latitude,
     longitude: this.state.room.longitude,
     latitudeDelta: 0.05,
     longitudeDelta: 0.05,
   };
   this.setState({ region: initRegion });

   var pointCoordinate = {
     latitude: this.state.room.latitude,
     longitude: this.state.room.longitude,
   };
   var circleElement = {
     latlng: pointCoordinate,
     radius: 350,
   };
   this.setState({ marker: circleElement });
 }

 onPressContactHost () {
   if (this.state.user && this.state.user.username === 'GUEST_USER') {
     this.openContactModal();
   } else if (this.state.isHost == true) {
     // do nothing
   } else {
     this.contactHost();
   }
 }

 contactHost () {
   this.state.tracker.trackEvent('Messaging', 'contactHost', {
     label: this.state.user.username + ' to ' + this.state.room.owner.username,
     value: this.state.room.id,
   });
   this.props.navigation.navigate(
     'conversationScreen',
     {
       party: this.state.room.owner,
       username: this.state.user.username,
       room: this.state.room,
     }
   );
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

 updateUser () {
   CacheStore.get('user').then((value) => {
     if (value != null) {
       this.setState({
         user: value,
       }, () => {
         this.onRequestBookButtonPress();
       });
     }
   });
 }

 onRequestBookButtonPress () {
   if (this.state.user && this.state.user.username === 'GUEST_USER') {
     this.state.tracker.trackEvent('requestBook', 'buttonPress', {
       label: 'GUEST_USER forbidden',
       value: 0
     });
     this.openLoginModal();
   } else if (this.state.user && this.state.user.national_id == null || this.state.user.national_id === "" ) {
     this.state.tracker.trackEvent('requestBook', 'buttonPress', {
       label: this.state.user.username,
       value: 1
     });
     this.openNationalIdModal();
   } else if (this.state.user) {
     this.state.tracker.trackEvent('requestBook', 'buttonPress', {
       label: this.state.user.username,
       value: 200
     });
     this.props.navigation.navigate(
       'requestBookScreen', {
         room: this.state.room,
       });
   }
  //  this.props.navigation.navigate(
  //    'requestBook',{roomId: this.state.room.id}
  //  );
 }

  renderHouseType () {
    result = '';
    switch(this.state.room.room_type) {
    case 'SUITE':
      result = 'سوییت ';
      break;
    case 'VILLA':
      result = 'ویلای ';
      break;
    case 'HOUSE':
      result = 'خانه ';
      break;
    case 'APT':
      result = 'آپارتمان ';
      break;
    default:
      result = 'سوییت ';
    }

    switch(this.state.room.service_type) {
    case 'ENTIRE_HOME':
      result = result + 'کامل';
      break;
    case 'PRIVATE_ROOM':
      result = result + 'خصوصی';
      break;
    case 'SHARED_ROOM':
      result = result + 'مشترک';
      break;
    default:
      result = result + 'کامل';
    }

    return(
      <Text style={styles.housemodel}>{result}</Text>
    );
  }

  renderRefrig () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('FRIDGE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/refrigerator.png')} />
      );
    }
  }

  renderParking () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('PARKING') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/parking.png')} />
      );
    }
  }

  renderBarbecue () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('BARBECUE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/Barbecue.png')} />
      );
    }
  }

  renderBlanket () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('EXTRA_SLEEP_UTILS') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/blanket.png')} />
      );
    }
  }

  renderCanape () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('SOFA') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/canape.png')} />
      );
    }
  }

  renderConditioner () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('COOLER') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/conditioner.png')} />
      );
    }
  }

  renderDinnerTable () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('DINING_TABLE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/dinnertable.png')} />
      );
    }
  }

  renderElevator () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('ELEVATOR') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/elevator.png')} />
      );
    }
  }

  renderFoosball () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('TABLE_FOOTBALL') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/foosball.png')} />
      );
    }
  }

  renderKitchenware () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('KITCHEN_DISH') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/kitchenware.png')} />
      );
    }
  }

  renderMicrowave () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('MICROWAVE_OVEN') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/mircowave.png')} />
      );
    }
  }

  renderPavilion () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('PERGOLA') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/pavilion.png')} />
      );
    }
  }

  renderPingpong () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('PING_PONG') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/pingpong.png')} />
      );
    }
  }

  renderPool () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('POOL') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/pool.png')} />
      );
    }
  }

  renderStove () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('OVEN') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/stove.png')} />
      );
    }
  }

  renderTeamaker () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('TEA_MAKER') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/teamaker.png')} />
      );
    }
  }

  renderForeigntoilet () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('FOREIGN_TOILET') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
      );
    }
  }

  renderHanger () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('HANGER') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/hanger.png')} />
      );
    }
  }

  renderPetRule () {
    if (this.state.room.pet_allowed === false) {
      return(
        <View style={styles.banbox}>
          <View style={styles.baniconbox}>
          <Image style={styles.banicon} source={require("./img/dog.png")}/>
          </View>
          <Text style={styles.bantext}>ممنوعیت ورود حیوان خانگی</Text>
        </View>
      );
    }
  }

  renderSmokeRule () {
    if (this.state.room.smoking_allowed === false) {
      return(
        <View style={styles.banbox}>
          <View style={styles.baniconbox}>
          <Image style={styles.banicon} source={require("./img/cigarette.png")}/>
          </View>
          <Text style={styles.bantext}>
            ممنوعیت استعمال دخانیات
          </Text>
        </View>
      );
    }
  }

  renderSpecialRules () {
    if (this.state.room.special_rules != '') {
      return(
        <View style={styles.banbox}>
          <View style={styles.baniconbox}>
          <Image style={styles.banicon} source={require("./img/special_rules.png")}/>
          </View>
          <Text style={styles.bantext}>{this.state.room.special_rules}</Text>
        </View>
      );
    }
  }

  renderPartyRule () {
    if (this.state.room.party_allowed === false) {
      return(
        <View style={styles.banbox}>
          <View style={styles.baniconbox}>
          <Image style={styles.banicon} source={require("./img/singles.png")}/>
          </View>
          <Text style={styles.bantext}>ممنوعیت برگزاری مراسم</Text>
        </View>
      );
    }
  }

  renderRestrictionSection () {
    if (this.state.room.pet_allowed === false ||
      this.state.room.smoking_allowed === false ||
      this.state.room.party_allowed === false ||
      this.state.room.special_rules != ''
    ) {
      return(
        <View>
        <View style={styles.checkinbox}>
        <Text style={styles.h2}>
          قوانین و محدودیت‌ها
        </Text>
        </View>

        {this.renderPetRule()}
        {this.renderSmokeRule()}
        {this.renderPartyRule()}
        {this.renderSpecialRules()}

        <View style={styles.divider}>
        </View>

        </View>
      );
    } else {
      return null;
    }
  }

  renderDescription () {
    if (this.state.room.description != null &&
        this.state.room.description != ''
      ) {
        return(
          <View>
          <View style={styles.checkinbox}>
          <Text style={styles.h2}>درباره این خانه</Text>
          </View>

          <View style={styles.rightAlignmentBox}>
          <Text style={styles.explanation}>
            {this.state.room.description}
          </Text>
          </View>

          <View style={styles.divider}>
          </View>

          </View>
        );
    }
  }

  imagesDataFeed () {
    result = [];
    if (this.state.room.images) {
      for (var i = 0; i < this.state.room.images.length; i++) {
        result.push(productionURL + this.state.room.images[i].image);
      }
    }
    result.push(productionURL + this.state.room.preview_high);
    result.reverse();
    var dataSource = new ViewPager.DataSource ({
      pageHasChanged: ( p1, p2 ) => p1 !== p2,
    });
    this.setState({
      imagesData: dataSource.cloneWithPages(result),
    });
  }

  renderImage (item) {
    return(
      <Image
        style={styles.imageSliderStyle}
        source={{uri: item}}
      />
    );
  }

  renderViewPager () {
    if (this.state.imagesData != null) {
      return(
        <ViewPager
          dataSource={this.state.imagesData}
          renderPage={this.renderImage}
          renderPageIndicator={this.renderIndicator}
          isLoop={true}
          initialPage={0}/>
      );
    }
  }

  renderMap () {
    if (this.state.marker && this.state.region) {
        return(
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              customMapStyle={this.mapStyle}
              style={styles.map}
              region={this.state.region}
              // gestureHandling={'cooperative'}
              onRegionChange={this.onRegionChange.bind(this)}>
              <MapView.Circle
                center={this.state.marker.latlng}
                radius={this.state.marker.radius*4/2}
                strokeColor={'#43cee6'}
                strokeWidth={3}
                fillColor={'rgba(18,178,206,0.2)	'}
              />
            </MapView>
          </View>
        );
    }
  }

  renderProfilePicture () {
    if (this.state.room.owner && this.state.room.owner.profile_picture == null) {
      return(
        <View style={styles.accountimage}>
          <Icon
            name='account-circle'
            size={70}
            color='#c2c2c2'
          />
        </View>
      );
    }
    if (this.state.room.owner) {
      return(
        <Image style={styles.accountimage} source={{
          uri: productionURL + this.state.room.owner.profile_picture
        }}/>
      );
    }
  }

  renderTimeField (timeField) {
    if (timeField) {
      return (timeField.substr(0, 5));
    }
  }

  renderRating () {
    if (this.state.room.rating_no > 0) {
      var rating = this.state.room.rating;
      if (rating - Math.floor(rating) < 0.5) {
        rating = Math.floor(rating);
      } else {
        rating = Math.ceil(rating);
      }
      return(
        <View style={styles.stars1}>
        <Stars
       value={5-rating}
       spacing={0}
       count={5}
       starSize={20}
       fullStar= {require('./img/starBlank.png')}
       emptyStar= {require('./img/starFilled.png')}/>
          </View>
      );
    }
  }

  openFacilities = () => {
    this.setState({
      facilitiesModalVisible: true,
    });
  }

  closeFacilities = () => {
    this.setState({
      facilitiesModalVisible: false,
    });
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

  openSupportModal = () => {
    this.setState({
      callSupportModalVisible: true,
    });
  }

  closeSupportModal = () => {
    this.setState({
      callSupportModalVisible: false,
    });
  }

  openNationalIdModal = () => {
    this.setState({
      nationalIdModalVisible: true,
    });
  }

  closeNationalIdModal = () => {
    this.setState({
      nationalIdModalVisible: false,
    });
  }

  resetProfilePage = () => {
    CacheStore.set('GuestScreen_tabName', 'profile');
    CacheStore.set('openEditProfile', true);
    this.props.navigation.navigate('guestScreen');
  }

  openContactModal = () => {
    this.setState({
      contactModalVisible: true,
    });
  }

  closeContactModal = () => {
    this.setState({
      contactModalVisible: false,
    });
  }

  renderPrice (input) {
    var res = input.substr(input.length - 3);
    input = input.substring(0, input.length - 3);
    while (input.length > 3) {
      res = input.substr(input.length - 3) + ',' + res;
      input = input.substring(0, input.length - 3);
    }
    res = input + ',' + res;
    return(res);
  }

  renderBottomButton () {
    if (this.state.isHost) {
      return(
        <TouchableOpacity
          style={styles.buttontouch}
          onPress={()=>{
            this.openSupportModal();
          }}>
          <View style={styles.buttonview}>
          <Text style={styles.reservebuttontext}>تغییر اطلاعات</Text>
        </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity
          style={styles.buttontouch}
          onPress={this.updateUser.bind(this)}>
          <View style={styles.buttonview}>
          <Text style={styles.reservebuttontext}>رزرو کنید!</Text>
        </View>
        </TouchableOpacity>
      );
    }
  }

  renderBottomBar () {
    if (this.state.room.is_price_per_person) {
      return(
        <View style={styles.bottombarchild}>
          <Text style={styles.mablaghtext}>هزینه هر شب هر نفر</Text>
          <View style={styles.bottombarprice}>
            <Text style={styles.pricetext} numberOfLines={1}>
              {this.renderPrice(String(this.state.room.price))} تومان
            </Text>
          </View>
          <View style={styles.bottombarbutton}>
              {this.renderBottomButton()}
          </View>
        </View>
      );
    } else {
      return(
        <View style={styles.bottombarchild}>
          <Text style={styles.mablaghtext}>هزینه هر شب</Text>
          <View style={styles.bottombarprice}>
            <Text style={styles.pricetext} numberOfLines={1}>
              {this.renderPrice(String(this.state.room.price))} تومان
            </Text>
          </View>
          <View style={styles.bottombarbutton}>
              {this.renderBottomButton()}
          </View>
        </View>
      );
    }
  }

  onPressBackButton () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  likeRoom() {
    fetch(productionURL + '/bookmark/api/like/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        room_id: this.state.room.id,
      }),
    })
    .then((response) => this.onLikeRoomResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
    });
  }

  unlikeRoom() {
    fetch(productionURL + '/bookmark/api/unlike/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        room_id: this.state.room.id,
      }),
    })
    .then((response) => this.onUnlikeRoomResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
    });
  }

  onLikePress () {
    if (!this.state.inMidLiking) {
      if (this.state.isLiked) {
        this.setState({
          isLiked: false,
        }, () => {
          this.unlikeRoom();
        });
      } else {
        this.setState({
          isLiked: true,
        }, () => {
          this.likeRoom();
        });
      }
      this.setState({
        inMidLiking: true,
      });
    }
  }

  onLikeRoomResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (!body.successful) {
        this.setState({
          isLiked: false,
        });
      }
    } else {
      this.setState({
        isLiked: false,
      });
    }
    this.setState({
      inMidLiking: false,
    });
  }

  onUnlikeRoomResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      if (!body.successful) {
        this.setState({
          isLiked: true,
        });
      }
    } else {
      this.setState({
        isLiked: true,
      });
    }
    this.setState({
      inMidLiking: false,
    });
  }

  renderBookmarkSection () {
    if (this.state.isLiked) {
      return(
        <TouchableOpacity onPress={() => {this.onLikePress()}}>
          <Image
            style={styles.bookmarkIcon}
            source={require('./img/bookmark/bookmark_filled.png')} />
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity onPress={() => {this.onLikePress()}}>
          <Image
            style={styles.bookmarkIcon}
            source={require('./img/bookmark/bookmark_outline.png')} />
        </TouchableOpacity>
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={{marginRight: 18}}>
          <TouchableOpacity onPress={() => {this.onPressBackButton()}}>
            <Icon size={28} color="#3e3e3e" name="arrow-forward" />
          </TouchableOpacity>
        </View>

        <View style={{marginLeft: 18}}>
          {this.renderBookmarkSection()}
        </View>
      </View>
      <ScrollView>
      {this.renderViewPager()}
      <View style={styles.container0}>
      <View style={styles.container2}>
      <View style={styles.checkinbox}>
        <Text style={styles.housename}>{this.state.room.title}</Text>
      </View>
      <View style={styles.city}>
        <Text style={styles.city1} numberOfLines={1}>{this.state.room.address}</Text>
      </View>

      {this.renderRating()}

    <View style={styles.divider}>
    </View>

<View style={styles.accountbox}>
    {this.renderProfilePicture()}
    <View style={styles.accountboxtexts}>
    {this.renderHouseType()}
    <View style={styles.hostname}>
    <Text style={styles.hostnamestatic}>به میزبانی </Text>
    <Text style={styles.hostnamedynamic}>{this.state.room.owner?this.state.room.owner.first_name:''} {this.state.room.owner?this.state.room.owner.last_name:''}</Text>

    </View>
    </View>
</View>

<View style={styles.divider}>
</View>

<View style={styles.detailbox}>
  <View style={styles.deatilitembox}>
    <Image style={styles.detailiconimg} source={require("./img/persons.png")}/>
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {this.state.room.capacity}</Text>
    <Text style={styles.detailicontext}>مهمان</Text>
    </View>
  </View>

  <View style={styles.deatilitembox}>
    <Image style={styles.detailiconimg} source={require("./img/rooms.png")}/>
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {this.state.room.rooms_number}</Text>
    <Text style={styles.detailicontext}>اتاق</Text>
    </View>
  </View>

  <View style={styles.deatilitembox}>
    <Image style={styles.detailiconimg} source={require("./img/facilities/beds.png")} />
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {Number(this.state.room.beds_number) + 2 * Number(this.state.room.double_beds_number)}</Text>
    <Text style={styles.detailicontext}>تخت</Text>
    </View>
  </View>

  <View style={styles.deatilitembox}>
    <Image style={styles.detailiconimg} source={require("./img/facilities/bath_tube.png")}/>
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {this.state.room.bath_room_number}</Text>
    <Text style={styles.detailicontext}>حمام</Text>
    </View>
  </View>
</View>

<View style={styles.divider}>
</View>

{this.renderDescription()}

<View style={styles.checkinbox}>
  <Text style={styles.h2}>امکانات</Text>
</View>

  <View style={styles.morefacilities}>
    {this.renderRefrig()}
    {this.renderParking()}
    {this.renderBarbecue()}
    {this.renderBlanket()}
    {this.renderCanape()}
    {this.renderConditioner()}
    {this.renderDinnerTable()}
    {this.renderElevator()}
    {this.renderFoosball()}
    {this.renderHanger()}
</View>
<View style={styles.morefacilities}>
  {this.renderKitchenware()}
  {this.renderMicrowave()}
  {this.renderPavilion()}
  {this.renderPingpong()}
  {this.renderPool()}
  {this.renderStove()}
  {this.renderTeamaker()}
  {this.renderForeigntoilet()}
  <TouchableOpacity onPress={this.openFacilities}>
    <Text style={{fontSize:16,fontFamily:'IRANSansMobileFaNum-Medium',color:'#00b1ce'}}> + بیشتر </Text>
  </TouchableOpacity>
</View>
</View>
</View>

<View style={styles.container0}>
  <View style={styles.container2}>
  <View style={styles.divider}>
  </View>

    <View style={styles.checkinbox}>
      <Text style={styles.checktime}>ساعت ورود: از</Text>
      <Text style={styles.h2}>{this.renderTimeField(this.state.room.check_in_from)}</Text>
      <Text style={styles.h2}> تا </Text>
      <Text style={styles.h2}>{this.renderTimeField(this.state.room.check_in_till)}</Text>
    </View>

    <View style={styles.checkinbox}>
      <Text style={styles.checktime}>ساعت خروج:</Text>
      <Text style={styles.h2}>قبل از </Text>
      <Text style={styles.h2}>{this.renderTimeField(this.state.room.check_out)}</Text>

    </View>

    <View style={styles.divider}>
    </View>

    <View style={styles.detailbox}>
      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>عادی</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}> {this.state.room.price}</Text>
        <Text style={styles.detailicontext}>
          تومان
        </Text>
        </View>
      </View>

      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>آخر هفته</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}> {this.state.room.weekend_price}</Text>
        <Text style={styles.detailicontext}>
          تومان
        </Text>
        </View>
      </View>

      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>ایام خاص</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}> {this.state.room.special_offer_price}</Text>
        <Text style={styles.detailicontext}>
          تومان
        </Text>
        </View>
      </View>

    </View>

    <View style={styles.divider}>
    </View>

    {this.renderRestrictionSection()}

    <View style={styles.contacthost}>
    <Text style={styles.lawstext1}>ارتباط با میزبان درباره این خانه:</Text>
    <TouchableOpacity onPress={this.onPressContactHost.bind(this)}>
    <Text style={styles.lawstext2}>ارسال پیام</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.divider}>
    </View>

    </View>
  </View>

  {this.renderMap()}

  <View style={{height:20,}}>
  </View>

  <Modal
    animationType='slide'
    transparent={false}
    visible={this.state.facilitiesModalVisible}
    onRequestClose={() => {
      this.closeFacilities();
    }}>
       <Facilities room={this.state.room} onClose={this.closeFacilities}>
       </Facilities>
  </Modal>
</ScrollView>
<View style={styles.bottombar}>
      {this.renderBottomBar()}
    </View>


  <Modal
    animationType="slide"
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
      <Text style={styles.popuptext}>برای درخواست رزرو ابتدا وارد حساب کاربری خود شوید.</Text>
        <TouchableOpacity style={styles.buttontouch1} onPress={() => {
          this.resetNavigation('login');
        }}>
        <View>
        <Text style={styles.reservebuttontext}>ورود</Text>
      </View>
      </TouchableOpacity>
    </View>
   </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={this.state.nationalIdModalVisible}
    onRequestClose={() => {
      this.closeNationalIdModal();
    }}>
   <View style={styles.popup}>
   <TouchableOpacity onPress={this.closeNationalIdModal}>
     <View style={styles.backbuttonview}>
       <Icon size={40} color="#f3f3f3" name="close" />
     </View>
   </TouchableOpacity>
    <View style={styles.popuptextbox}>
      <Text style={styles.popuptext}>برای درخواست رزرو باید وارد ویرایش حساب کاربری شده و شماره ملی خود را وارد نمایید.</Text>
        <TouchableOpacity style={styles.buttontouch1} onPress={() => {
          this.closeNationalIdModal();
          this.resetProfilePage();
        }}>
        <View>
        <Text style={styles.reservebuttontext}>حساب کاربری</Text>
      </View>
      </TouchableOpacity>
    </View>
   </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={this.state.contactModalVisible}
    onRequestClose={() => {
      this.closeContactModal();
    }}>
   <View style={styles.popup}>
   <TouchableOpacity onPress={this.closeContactModal}>
     <View style={styles.backbuttonview}>
       <Icon size={40} color="#f3f3f3" name="close" />
     </View>
   </TouchableOpacity>
    <View style={styles.popuptextbox}>
      <Text style={styles.popuptext}>برای تماس با میزبان ابتدا باید وارد حساب کاربری خود شوید.</Text>
        <TouchableOpacity style={styles.buttontouch1} onPress={() => {
          this.resetNavigation('login');
        }}>
        <View>
        <Text style={styles.reservebuttontext}>ورود</Text>
      </View>
      </TouchableOpacity>
    </View>
   </View>
  </Modal>

  <Modal
    animationType="slide"
    transparent={true}
    visible={this.state.callSupportModalVisible}
    onRequestClose={() => {
      this.closeSupportModal();
    }}>
   <View style={styles.popup}>
   <TouchableOpacity onPress={this.closeSupportModal}>
     <View style={styles.backbuttonview}>
       <Icon size={40} color="#f3f3f3" name="close" />
     </View>
   </TouchableOpacity>
    <View style={styles.popuptextbox}>
      <Text style={styles.popuptext}>
برای ویرایش اطلاعات این خانه لطفا با واحد پشتیبانی تریپین تماس بگیرید.
      </Text>
        <TouchableOpacity style={styles.buttontouch2} onPress={() => {
          Communications.phonecall(this.state.callCenter, true);
        }}>
        <View>
        <Text style={styles.reservebuttontext}>تماس با پشتیبانی</Text>
      </View>
      </TouchableOpacity>
    </View>
   </View>
  </Modal>

</View>
  );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width,
    height: 56,
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  },
  container2: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection:'column',
    width: Dimensions.get('window').width - 50,
  },
  housename: {
    fontSize:28,
    fontFamily:"IRANSansMobileFaNum-Medium",
    marginTop:22,
    color:"#4f4f4f",
    ...Platform.select({
      ios: {
        textAlign:'right',
      },
    }),
  },
  city: {
    flexDirection:'row-reverse',
    justifyContent:'flex-start',
  },
  city1: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum',
    color:"#3e3e3e"
  },
  stars1: {
    alignItems: "flex-end",
  },
  accountbox: {
    flexDirection:'row-reverse',
    alignItems: "flex-end",
  },
  accountboxtexts: {
    alignItems: "flex-end",
    height: 75,
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop:10,
  },
  accountimage: {
    height: 75,
    width: 75,
    borderRadius: 37,
    marginLeft: 15,
  },
  housemodel: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Medium',
  },
  hostname: {
    flexDirection:'row-reverse',
    alignItems: "flex-end",
    justifyContent:"space-around",
  },
  hostnamestatic: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#4f4f4f",
  },
  divider:{
    height: 2,
    backgroundColor: "#d7d7d7",
    marginTop: 20,
    marginBottom: 20,
  },
  container0: {
    flex:1,
    flexDirection: "column",
    alignItems:"center",
  },
  hostnamedynamic: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#00b1ce",
  },
  detailiconimg: {
    width:40,
    height:40,
    resizeMode: 'contain',
  },
  detailbox: {
    flex: 1,
    flexDirection:"row-reverse",
    alignItems:'center',
    justifyContent:"space-around",
    marginTop:10,
  },
  detailicontextbox: {
    flexDirection:'row-reverse',
    marginLeft:28,
    marginRight:28,
    marginBottom:15,
  },
  detailicontext: {
    fontSize: 14,
    fontFamily:'IRANSansMobileFaNum',
    color:"#3e3e3e",
  },
  deatilitembox:{
    alignItems:'center',
  },
  h2: {
    fontSize: 18,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#3e3e3e",
  },
  explanation: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontSize: 14,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#3e3e3e",
  },
  mapstyle: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain' ,
  },
  bottombar: {
    width: Dimensions.get('window').width,
    height:56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent:"center",
    elevation:5,
  },
  bottombarchild: {
    width: Dimensions.get('window').width-40,
    alignSelf:'center',
    flex:1,
    flexDirection: "row-reverse",
    marginRight:15,
  },
  bottombarprice: {
    flex:3,
    flexDirection:"row-reverse",
    justifyContent:"flex-start",
    alignItems:'center',
    marginTop:3,
  },
  bottombarbutton: {
    flex:2,
    alignItems:'center',
    justifyContent:"center",
  },
  pricetext: {
    fontSize: 18,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#3e3e3e",
    justifyContent: "center",
    alignItems: "center",
    marginTop:5,
  },
  mablaghtext:{
    fontSize: 12,
    fontFamily:"IRANSansMobileFaNum-Light",
    color: "#3e3e3e",
    marginTop:6,
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
  buttontouch: {
    borderColor:"#f56e4e",
    borderRadius: 50,
    borderWidth : 2,
    height:46,
    width: 148,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
    ...Platform.select({
      ios: {
        height:46,
        width: 130,
      },
    }),
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
  buttontouch2: {
    height:48,
    width: 188,
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 2,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttonview: {
    backgroundColor:"#f56e4e",
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
    ...Platform.select({
      ios: {
        height:38,
        width: 122,
        borderRadius: 24,
      },
      android: {
        height:38,
        borderRadius: 50,
        width: 139,
      },
    }),
  },
  rightAlignmentBox: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  checkinbox:{
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom:5,
  },
  checktime:{
    fontSize: 18,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#3e3e3e",
    marginLeft:8,
  },
  pricetitletext:{
    fontSize: 18,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: '#00b1ce',
    marginLeft: 8,
  },
  banbox: {
    flexDirection:"row-reverse" ,
    alignItems:"flex-start",
    marginTop:5,
  },
  baniconbox: {
    backgroundColor: "#f3f3f3",
    borderRadius:50,
    height:40,
    width:40,
    alignItems:"center",
    justifyContent:"center",
    marginLeft:10,
  },
  banicon: {
    height:25,
    width:25,
    alignItems:"center",
    justifyContent:"center",
    resizeMode: "contain"
  },
  bantext: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#3e3e3e",
    marginRight:2,
    justifyContent:"center",
    marginLeft:50,
    ...Platform.select({
      ios: {
        marginTop: 6,
        textAlign:'right',
      },
    }),
  },
  contacthost: {
    flexDirection: "row-reverse"
  },
  lawstext1: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#3e3e3e",
    marginLeft:5,
  },
  lawstext2: {
    fontSize: 16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#00cecc",
    marginLeft:5,
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: Dimensions.get('window').width,
  },
  map:{
    ...StyleSheet.absoluteFillObject,
  },
  popup:{
    backgroundColor:  'rgba(0,0,0,0.82)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  popuptext:{
    color:'white',
    fontFamily:'IRANSansMobileFaNum-Medium',
    fontSize:20,
    textAlign:'center',
    width: Dimensions.get('window').width - 50,
    marginTop:180,
    marginBottom:30,
  },
  popuptextbox:{
    alignItems:'center'
  },
  backbuttonview:{
    alignItems:'flex-end',
    marginRight:25,
    marginTop:25,
  },
  imageSliderStyle: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  morefacilities:{
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'center',
    marginTop:15,
    marginLeft:15,
    marginRight:15,
  },
  icon:{
    height:30,
    width:20,
    resizeMode:"contain",
    marginLeft:6,
    marginRight:6,
    opacity:0.78,
  },
  bookmarkIcon: {
    height: 25,
    width: 30,
    resizeMode: 'contain',
  },
});

export default HouseDetail;
