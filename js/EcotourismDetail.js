import React, { Component } from 'react';
import {
  View,
  BackHandler,
  ScrollView,
  Text,
  Modal,
  StyleSheet,
  Alert,
  TextInput,
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
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';
import ViewPager from './common/custom-viewpager';
import EcotourismFacilities from './EcotourismFacilities';
import { productionURL, GATrackerId } from './data';


class EcotourismDetail extends Component {
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
     likeLoginModalVisible: false,
     contactModalVisible: false,
     facilitiesModalVisible: false,
     nationalIdModalVisible: false,
     callSupportModalVisible: false,
     tracker: null,
     isHost: false,
     callCenter: null,
     isLiked: false,
     inMidLiking: false,
     priceEditMode: false,
   };
   this.mapStyle = [];
 }

 onRegionChange(region) {
   this.setState({ region });
 }

 componentDidMount () {
   let tracker = new GoogleAnalyticsTracker(GATrackerId);
   tracker.trackScreenView('EcotourismDetail');
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

 componentWillMount () {
   BackHandler.addEventListener('hardwareBackPress_eco_bookmark', this.handleBackButton);
 }

 componentWillUnmount () {
   BackHandler.removeEventListener('hardwareBackPress_eco_bookmark', this.handleBackButton);
 }

 handleBackButton = () => {
   this.onPressBackButton();
   return true;
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
   fetch(productionURL + '/api/get/ecotourism/', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Token ' + this.state.token,
     },
     body: JSON.stringify({
       ecotourism_id: roomId,
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
       eco_room: this.state.room,
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
 }

  renderHouseType () {
    result = '';
    if (this.state.room.type && this.state.room.type=='ecotourism') {
      result = 'اقامتگاه بوم‌گردی';
    }

    return(
      <Text style={styles.housemodel}>{result}</Text>
    );
  }

  renderTVFeature () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('TV') > -1) {
      return(
        <Image style={styles.icon} source={require("./img/facilities/tv.png")}/>
      );
    }
  }

  renderRefrig () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('FRIDGE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/refrigerator.png')} />
      );
    }
  }

  renderParking () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('PARKING') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/parking.png')} />
      );
    }
  }

  renderKorsi () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('KORSI') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/korsi.png')} />
      );
    }
  }

  renderHerbaltea () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('HERBAL_TEA') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/herbal_tea.png')} />
      );
    }
  }

  renderCanape () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('SOFA') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/canape.png')} />
      );
    }
  }

  renderConditioner () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('COOLER') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/conditioner.png')} />
      );
    }
  }

  renderHeater () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('HEATER') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/heater.png')} />
      );
    }
  }

  renderDinnerTable () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('DINING_TABLE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/dinnertable.png')} />
      );
    }
  }

  renderKitchenware () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('COOKING_UTILS') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/kitchenware.png')} />
      );
    }
  }

  renderGuestInsurance () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('GUEST_INSURANCE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/insurance.png')} />
      );
    }
  }

  renderMobileCoverage () {
    if (this.state.room.general_util_options && this.state.room.general_util_options.indexOf('MOBILE_NETWORK_COVEREGE') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/mobile_tower.png')} />
      );
    }
  }

  renderStove () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('OVEN') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/stove.png')} />
      );
    }
  }

  renderForeigntoilet () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('SHARED_FOREIGN_TOILET') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
      );
    } else if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('ENTIRE_FOREIGN_TOILET') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
      );
    } else {
      return null;
    }
  }

  renderWifiFeature () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('NET') > -1) {
      return(
        <Image style={styles.icon} source={require("./img/facilities/wifi.png")}/>
      );
    }
  }

  renderBathroom () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('SHARED_BATHROOM') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/baths.png')} />
      );
    } else if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('ENTIRE_BATHROOM') > -1) {
      return(
        <Image style={styles.icon} source={require('./img/facilities/baths.png')} />
      );
    } else {
      return null;
    }

  }

  renderWashingMachineFeature () {
    if (this.state.room.general_utils_options && this.state.room.general_utils_options.indexOf('WASHING_MACHINE') > -1) {
      return(
        <Image style={styles.icon} source={require("./img/facilities/washing_machine.png")}/>
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

  renderAttractionParts () {
    return this.state.room.tourism_attractions.map((attraction) => {
      return(
        <View style={{
          backgroundColor: '#5fafb8',
          marginLeft: 6,
          marginTop: 6,
          borderRadius: 6,
        }}>
        <Text style={styles.attractionparttext}>
          {attraction}
        </Text>
        </View>
      )
    });
  }

  renderAttractionSection () {
    if (this.state.room.tourism_attractions &&
        this.state.room.tourism_attractions.length > 0
    ) {
      return(
        <View>
          <View style={styles.checkinbox}>
            <Text style={styles.h2}>
              جاذبه‌های گردشگری
            </Text>
          </View>

          <View style={styles.attractionpartbox}>
          {this.renderAttractionParts()}
          </View>

        <View style={styles.divider}>
        </View>

        </View>
      );
    } else {
      return null;
    }
  }

  renderAccessibilitySection () {
    if (this.state.room.accessibility != null &&
        this.state.room.accessibility != ''
    ) {
      return(
        <View>
        <View style={styles.checkinbox}>
        <Text style={styles.h2}>
          نحوه دسترسی
        </Text>
        </View>

        <View style={styles.rightAlignmentBox}>
        <Text style={styles.explanation}>
          {this.state.room.accessibility}
        </Text>
        </View>

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

  togglePriceEditMode = () => {
    if (this.state.priceEditMode) {
      this.setState({
        priceEditMode: false,
      });
    }else{
      this.setState({
        priceEditMode: true,
      });
    }
  }

  closeLoginModal = () => {
    this.setState({
      loginModalVisible: false,
    });
  }

  openLikeLoginModal = () => {
    this.setState({
      likeLoginModalVisible: true,
    });
  }

  closeLikeLoginModal = () => {
    this.setState({
      likeLoginModalVisible: false,
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
    if (input.length > 0){
      res = input + ',' + res;
    }
    return(res);
  }

  renderFoodPreview () {
    if (this.state.room.food_service_type &&
        this.state.room.food_service_type.length > 0
      ) {
        var desc = '';
        var items = 0;
        if (this.state.room.food_service_type.indexOf('BREAK_FAST_INCLUDED') > -1) {
          desc += 'صبحانه';
          items += 1;
        }
        if (this.state.room.food_service_type.indexOf('LUNCH_INCLUDED') > -1) {
          if (desc === '') {
            desc = 'ناهار';
          } else {
            desc += '، ناهار';
          }
          items += 1;
        }
        if (this.state.room.food_service_type.indexOf('DINNER_INCLUDED') > -1) {
          if (desc === '') {
            desc = 'شام';
          } else {
            desc += '، شام';
          }
          items += 1;
        }
        return(
          <View style={styles.toppreviewtextpart}>
            <Text style={styles.h3}>
              {items} وعده
            </Text>
            <Text style={styles.toppreviewdetailtext}>
              {desc}
            </Text>
          </View>
        );
    } else {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            بدون غذا
          </Text>
          <Text style={styles.toppreviewdetailtext}>
          </Text>
        </View>
      );
    }
  }

  renderSleepPreview () {
    if (this.state.room.general_utils_options &&
        this.state.room.total_capacity > 0
      ) {
        var desc = '';
        if (this.state.room.general_utils_options.indexOf('BED') > -1) {
          desc += 'تخت خواب';
        }
        if (this.state.room.general_utils_options.indexOf('MATTRESS') > -1) {
          if (desc === '') {
            desc = 'سنتی';
          } else {
            desc += ' + سنتی';
          }
        }
        return(
          <View style={styles.toppreviewtextpart}>
            <Text style={styles.h3}>
              {this.state.room.total_capacity} سرویس خواب
            </Text>
            <Text style={styles.toppreviewdetailtext}>
              {desc}
            </Text>
          </View>
        );
      } else {
        return(
          <View style={styles.toppreviewtextpart}>
            <Text style={styles.h3}>
            </Text>
            <Text style={styles.toppreviewdetailtext}>
            </Text>
          </View>
        );
      }
  }

  renderRoomsPreview () {
    if (this.state.room.rooms_number > 0) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            {this.state.room.rooms_number} اتاق
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            در اقامتگاه
          </Text>
        </View>
      );
    } else {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
          </Text>
          <Text style={styles.toppreviewdetailtext}>
          </Text>
        </View>
      );
    }
  }

  renderAccessType () {
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('RURAL') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            روستایی
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('URBAN') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            شهری
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('COASTAL') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            ساحلی
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('JUNGLE') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            جنگلی
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('GROVE') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            دشت
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    if (this.state.room.room_type &&
        this.state.room.room_type.indexOf('DESERT') > -1
    ) {
      return(
        <View style={styles.toppreviewtextpart}>
          <Text style={styles.h3}>
            صحرایی
          </Text>
          <Text style={styles.toppreviewdetailtext}>
            محیط اطراف
          </Text>
        </View>
      );
    }
    return(
      <View style={styles.toppreviewtextpart}>
      <Text style={styles.h3}>
        دشت
      </Text>
      <Text style={styles.toppreviewdetailtext}>
        محیط اطراف
      </Text>
      </View>
    );
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
          <Text style={styles.reservebuttontext2}>تغییر اطلاعات</Text>
        </View>
        </TouchableOpacity>
      );
    } else {
      return(
        <TouchableOpacity
          style={styles.buttontouch}
          onPress={this.updateUser.bind(this)}>
          <View style={styles.buttonview}>
          <Text style={styles.reservebuttontext}>رزرو کنید</Text>
        </View>
        </TouchableOpacity>
      );
    }
  }

  renderBottomBar () {
    if (this.state.room.is_price_per_person) {
      return(
        <View style={styles.bottombarchild}>
          <View style={styles.bottombarbutton}>
              {this.renderBottomButton()}
          </View>
          <View style={styles.bottombarprice}>
            <Text style={styles.mablaghtext}>هزینه هر شب هر نفر</Text>
            <Text style={styles.pricetext} numberOfLines={1}>
              {this.renderPrice(String(this.state.room.price))} تومان
            </Text>
          </View>
        </View>
      );
    } else {
      return(
        <View style={styles.bottombarchild}>
        <View style={styles.bottombarbutton}>
            {this.renderBottomButton()}
        </View>
        <View style={styles.bottombarprice}>
          <Text style={styles.mablaghtext}>هزینه هر شب</Text>
            <Text style={styles.pricetext} numberOfLines={1}>
              {this.renderPrice(String(this.state.room.price))} تومان
            </Text>
          </View>
        </View>
      );
    }
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
        eco_room_id: this.state.room.id,
      }),
    })
    .then((response) => this.onLikeRoomResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
    });
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

  unlikeRoom() {
    fetch(productionURL + '/bookmark/api/unlike/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        eco_room_id: this.state.room.id,
      }),
    })
    .then((response) => this.onUnlikeRoomResponseRecieved(response))
    .catch((error) => {
      Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
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

  onLikePress () {
    if (this.state.user && this.state.user.username === 'GUEST_USER') {
      this.openLikeLoginModal();
    } else if (this.state.user) {
      this.state.tracker.trackEvent('likeRoom', 'buttonPress', {
        label: this.state.user.username,
        value: 200
      });
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
  }

  onPressBackButton () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
    if (this.props.navigation.state.params.refreshScreen) {
      this.props.navigation.state.params.refreshScreen();
    }
    //console.log('*** back' + this.props.navigation.state.previousState);
  }

  renderPriceEditor (value) {
    if (this.state.priceEditMode){
      return (
        <TextInput
                style={styles.detailiconteditbox}
                placeholder="_______"
                placeholderTextColor="#acacac"
                maxLength = {10}
                multiline={false}
                keyboardType = 'numeric'
                value={value.stringify}
                underlineColorAndroid={'transparent'} />
        );
    }else{
      return (
      <Text style={styles.detailicontext}>{this.renderPrice(String(value))}</Text>
      );
    }
  }

  renderPriceEditorButton () {
    if (this.state.priceEditMode){
      return (
        <Text style={styles.lawstext2}>ثبت قیمت</Text>
      );
    }else{
      return (
        <Text style={styles.lawstext2}>اصلاح قیمت</Text>
      );
    }
  }

  renderBookmarkSection () {
    if (this.state.isLiked) {
      return(
        <TouchableOpacity onPress={() => {this.onLikePress()}}>
          <Icon size={30} color="#ea4f50" name="favorite" />
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

<View style={styles.toppreviewbox}>

  <View style={styles.toppreviewrow}>

    <View style={styles.toppreviewitem1}>
      <Image style={styles.detailiconimg} source={require("./img/rooms.png")}/>
      {this.renderRoomsPreview()}
    </View>

    <View style={styles.toppreviewitem2}>
      <Image style={styles.detailiconimg} source={require("./img/pillow.png")}/>
      {this.renderSleepPreview()}
    </View>

  </View>

  <View style={styles.toppreviewrow}>

    <View style={styles.toppreviewitem1}>
      <Image style={styles.detailiconimg} source={require("./img/urban-rural.png")}/>
      {this.renderAccessType()}
    </View>

    <View style={styles.toppreviewitem2}>
      <Image style={styles.detailiconimg} source={require("./img/foods.png")}/>
      {this.renderFoodPreview()}
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
    {this.renderKorsi()}
    {this.renderHerbaltea()}
    {this.renderCanape()}
    {this.renderConditioner()}
    {this.renderDinnerTable()}
    {this.renderWifiFeature()}
    {this.renderBathroom()}
</View>
<View style={styles.morefacilities}>
  {this.renderKitchenware()}
  {this.renderGuestInsurance()}
  {this.renderMobileCoverage()}
  {this.renderStove()}
  {this.renderForeigntoilet()}
  {this.renderTVFeature()}
  {this.renderHeater()}
  {this.renderWashingMachineFeature()}
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

    <TouchableOpacity onPress={this.togglePriceEditMode}>
    {this.renderPriceEditorButton()}
    </TouchableOpacity>

    <View style={styles.detailbox}>
      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>عادی</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}>
        {this.renderPriceEditor(this.state.room.price)}
        </Text>
        <Text style={styles.detailicontext}> تومان</Text>
        </View>
      </View>

      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>آخر هفته</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}>
        {this.renderPriceEditor(this.state.room.weekend_price)}
        </Text>
        <Text style={styles.detailicontext}> تومان</Text>
        </View>
      </View>

      <View style={styles.deatilitembox}>
        <Text style={styles.pricetitletext}>ایام خاص</Text>
        <View style={styles.detailicontextbox}>
        <Text style={styles.detailicontext}>
          {this.renderPriceEditor(this.state.room.special_offer_price)}
        </Text>
        <Text style={styles.detailicontext}> تومان</Text>
        </View>
      </View>

    </View>

    <View style={styles.divider}>
    </View>

    {this.renderRestrictionSection()}

    {this.renderAttractionSection()}

    {this.renderAccessibilitySection()}

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
       <EcotourismFacilities room={this.state.room} onClose={this.closeFacilities}>
       </EcotourismFacilities>
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
    visible={this.state.likeLoginModalVisible}
    onRequestClose={() => {
      this.closeLikeLoginModal();
    }}>
   <View style={styles.popup}>
   <TouchableOpacity onPress={this.closeLikeLoginModal}>
     <View style={styles.backbuttonview}>
       <Icon size={40} color="#f3f3f3" name="close" />
     </View>
   </TouchableOpacity>
    <View style={styles.popuptextbox}>
      <Text style={styles.popuptext}>
        برای افزودن خانه به علاقه‌مندی‌ها، ابتدا باید وارد حساب کاربری خود شوید.
      </Text>
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
    ...Platform.select({
      ios: {
        height: 72,
      },
      android: {
      },
    }),
  },
  container2: {
    flex:1,
    flexDirection:'column',
    width: Dimensions.get('window').width - 50,
    flexWrap: 'wrap',
  },
  housename: {
    fontSize:28,
    fontFamily:"IRANSansMobileFaNum-Medium",
    marginTop:22,
    color:"#4f4f4f",
    textAlign: "right",
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
    marginLeft: 6,
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
    flexDirection: "row-reverse",
    alignItems: 'center',
    justifyContent: "space-around",
    marginTop:10,
  },
  toppreviewbox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
    color:"#9e9e9e",
  },
  toppreviewdetailtext: {
    fontSize: 14,
    fontFamily:'IRANSansMobileFaNum',
    color:"#9e9e9e",
  },
  deatilitembox: {
    alignItems: 'center',
  },
  toppreviewrow: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 50,
    marginTop: 5,
    marginBottom: 5,
  },
  toppreviewitem1: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: Dimensions.get('window').width * 2/5 - 10,
  },
  toppreviewitem2: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: Dimensions.get('window').width * 3/5,
  },
  toppreviewtextpart: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginRight: 5,
  },
  h2: {
    fontSize: 18,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: "#3e3e3e",
  },
  h3: {
    fontSize: 17,
    fontFamily: 'IRANSansMobileFaNum-Medium',
    color: "#3e3e3e",
  },
  explanation: {
    textAlign: 'right',
    alignSelf: 'stretch',
    fontSize: 14,
    fontFamily: 'IRANSansMobileFaNum-Light',
    color: "#3e3e3e",
  },
  attractionparttext: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'IRANSansMobileFaNum',
    color: "#ffffff",
    marginLeft: 8,
    marginRight: 8,
  },
  mapstyle: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain',
  },
  bottombar: {
    width: Dimensions.get('screen').width,
    height:56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent:"center",
    elevation:5,
    ...Platform.select({
      ios: {
        borderTopWidth: 1,
        borderColor: '#ddd',
      },
      android: {
      },
    }),
  },
  bottombarchild: {
    flex:1,
    flexDirection: "row",
    width: Dimensions.get('window').width-40,
    alignItems: "center",
  },
  bottombarprice: {
    flex:3,
    marginTop:3,
  },
  pricediv: {
    flex:3,
  },
  bottombarbutton: {
    flex:2,
    alignItems:'center',
    justifyContent:"center",
    zIndex: 100,
  },
  pricetext: {
    fontSize: 18,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#3e3e3e",
    marginTop: 0,
    textAlign: "left",
    marginLeft: 14,
    ...Platform.select({
      ios: {
        fontSize: 16,
        textAlign: "center",
      },
      android: {
      },
    }),
  },
  mablaghtext:{
    fontSize: 12,
    fontFamily:"IRANSansMobileFaNum-Light",
    color: "#3e3e3e",
    marginTop: 0,
    textAlign: "right",
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
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
    ...Platform.select({
      ios: {
        height:46,
        width: 130,
      },
      android: {
        height: 46,
        width: 120,
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
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 188,
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
        borderRadius: 22,
        width: 110,
      },
    }),
  },
  rightAlignmentBox: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  attractionpartbox: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    flexWrap: 'wrap',
  },
  checkinbox:{
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom:5,
  },
  checktime:{
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:"#3e3e3e",
    marginLeft:8,
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 18,
      },
    }),
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
    fontSize: 18,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:"#3e3e3e",
    marginRight:2,
    justifyContent:"center",
    marginLeft:50,
    textAlign:"right",
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
    color: '#00b1ce',
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
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  reservebuttontext2: {
    fontSize: 15,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
});

export default EcotourismDetail;
