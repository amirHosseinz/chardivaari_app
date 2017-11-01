import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Modal,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Stars from 'react-native-stars';
import Button from 'apsl-react-native-button';
import ImageSlider from 'react-native-image-slider';
import StarRating from 'react-native-star-rating';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import ViewPager from 'react-native-viewpager';
import KeepAwake from 'react-native-keep-awake';

import ViewPager from './common/custom-viewpager';
import Facilities from './Facilities';
import { testURL, productionURL } from './data';


class HouseDetail extends Component {
  constructor(props) {
   super(props);
   this.state = {
     token: '',
     username: '',
     room: {},
     imagesData: null,
     region: null,
     marker: null,
     loginModalVisible: false,
     contactModalVisible: false,
     facilitiesModalVisible: false,
   };
   this.mapStyle = [];
 }

 onRegionChange(region) {
   this.setState({ region });
 }

 componentWillMount() {
   KeepAwake.activate();
 }

 componentDidMount () {
   CacheStore.get('token').then((value) => this.setToken(value));
   CacheStore.get('username').then((value) => this.setUsername(value));

   if (this.props.navigation.state.params.room) {
     this.setState({
       room: this.props.navigation.state.params.room,
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
   } else if (this.props.navigation.state.params.roomId) {
     this.fetchRoom();
   }
 }

 setToken (token) {
   this.setState({
     token
   });
 }

 setUsername (username) {
   this.setState({
     username
   });
 }

 fetchRoom () {
   fetch(productionURL + '/api/get/room/', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Token ' + this.state.token,
     },
     body: JSON.stringify({
       room_id: this.props.navigation.state.params.roomId,
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
   if (this.state.username && this.state.username === 'GUEST_USER') {
     this.openContactModal();
   } else {
     this.contactHost();
   }
 }

 contactHost () {
   fetch(productionURL + '/api/message/compose/', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Token ' + this.state.token,
     },
     body: JSON.stringify({
       sender: this.state.username,
       recipient: this.state.room.owner.username,
       subject: this.state.room.title,
       room_id: this.state.room.id,
       body: ' درخواست صحبت درباره‌ی خانه‌ی ' + this.state.room.title,
     }),
   })
   .then((response) => this.onResponseRecieved(response))
   .catch((error) => {
     // network error
     Alert.alert('از اتصال به اینترنت مطمئن شوید، سپس مجدد تلاش کنید.');
   });
 }

 onResponseRecieved (response) {
   if (response.status === 200) {
     body = JSON.parse(response._bodyText);
     this.props.navigation.navigate(
       'conversationScreen',
       {
         party: this.state.room.owner,
         messageId: body.message_id,
         username: this.state.username,
         room: this.state.room,
       }
     );
   } else {
     Alert.alert('خطایی رخ داده.');
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

 onRequestBookButtonPress () {
   if (this.state.username && this.state.username === 'GUEST_USER') {
     this.openLoginModal();
   } else {
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
      result = 'ویلا ';
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

  renderBreakfastFeature () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('BREAKFAST') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/breakfast.png")}/>
      );
    }
  }

  renderTVFeature () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('TV') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/tv.png")}/>
      );
    }
  }

  renderWifiFeature () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('NET') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/wifi.png")}/>
      );
    }
  }

  renderHangerFeature () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('HANGER') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/hanger.png")}/>
      );
    }
  }

  renderWashingMachineFeature () {
    if (this.state.room.private_util_options && this.state.room.private_util_options.indexOf('WASHING_MACHINE') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/washing_machine.png")}/>
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
          <Text style={styles.bantext}>ممنوعیت  استعمال دخانیات </Text>
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

  renderSpecialRules () {
    if (this.state.room.special_rules != '') {
      return(
        <View>
        <Text style={styles.h2}>قوانین خاص:</Text>
        <View style={styles.banbox}>
          <View style={styles.baniconbox}>
          <Image style={styles.banicon} source={require("./img/special_rules.png")}/>
          </View>
          <Text style={styles.bantext}>{this.state.room.special_rules}</Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  imageSliderFeed () {
    result = [];
    result.push(productionURL + this.state.room.preview);
    if (this.state.room.images) {
      for (var i = 0; i < this.state.room.images.length; i++) {
        result.push(productionURL + this.state.room.images[i].image);
      }
    }
    return (result);
  }

  imagesDataFeed () {
    result = [];
    result.push(productionURL + this.state.room.preview);
    if (this.state.room.images) {
      for (var i = 0; i < this.state.room.images.length; i++) {
        result.push(productionURL + this.state.room.images[i].image);
      }
    }
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
          initialPage={0} />
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
                radius={this.state.marker.radius*3/2}
                strokeColor={'#12b2ce'}
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

  render () {
    var rating = this.state.room.rating;
    if (rating - Math.floor(rating) < 0.5) {
      rating = Math.floor(rating);
    } else {
      rating = Math.ceil(rating);
    }

    return(
      <View style={styles.container}>
      <ScrollView
      showsHorizontalScrollIndicator={false}>
      {this.renderViewPager()}

<View style={styles.container0}>

<View style={styles.container2}>
  <Text style={styles.housename}>{this.state.room.title}</Text>
  <View style={styles.city}>
    <Text style={styles.city1}>{this.state.room.district}</Text>
    <Text style={styles.city1}>، </Text>
    <Text style={styles.city1}>{this.state.room.address}</Text>
  </View>
  <View style={styles.stars1}>
  <Stars
 value={5-rating}
 spacing={0}
 count={5}
 starSize={20}
 fullStar= {require('./img/starBlank.png')}
 emptyStar= {require('./img/starFilled.png')}/>
    </View>

<View style={styles.divider}>
</View>

<View style={styles.accountbox}>
    {this.renderProfilePicture()}
    <View style={styles.accountboxtexts}>
    {this.renderHouseType()}
    <View style={styles.hostname}>
    <Text style={styles.hostnamestatic}>به میزبانی </Text>
    <TouchableOpacity>
    <Text style={styles.hostnamedynamic}>{this.state.room.owner?this.state.room.owner.first_name:''} {this.state.room.owner?this.state.room.owner.last_name:''}</Text>
    </TouchableOpacity>

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
    <Image style={styles.detailiconimg} source={require("./img/baths.png")}/>
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {this.state.room.bath_room_number}</Text>
    <Text style={styles.detailicontext}>حمام</Text>
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
    <Image style={styles.detailiconimg} source={require("./img/beds.png")}/>
    <View style={styles.detailicontextbox}>
    <Text style={styles.detailicontext}> {this.state.room.beds_number}</Text>
    <Text style={styles.detailicontext}>تخت</Text>
    </View>
  </View>
</View>

<View style={styles.divider}>
</View>

<Text style={styles.h2}>درباره این خانه</Text>

<Text style={styles.explanation}>
  {this.state.room.description}
</Text>

<View style={styles.divider}>
</View>

<Text style={styles.h2}>سایر امکانات</Text>

    <View style={styles.features}>
    {this.renderBreakfastFeature()}
    {this.renderTVFeature()}
    {this.renderWifiFeature()}
    {this.renderHangerFeature()}
    {this.renderWashingMachineFeature()}
    <TouchableOpacity onPress={this.openFacilities}>
      <Text style={styles.seemore}>مشاهده بیشتر</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.divider}>
    </View>
</View>
</View>


{this.renderMap()}

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

    <Text style={styles.h2}>قوانین و محدودیت ها</Text>

    {this.renderPetRule()}
    {this.renderSmokeRule()}
    {this.renderPartyRule()}

    <View style={styles.divider}>
    </View>
    {this.renderSpecialRules()}
    <View style={styles.contacthost}>
    <Text style={styles.lawstext1}>ارتباط با میزبان درباره این خانه:</Text>
    <TouchableOpacity onPress={this.onPressContactHost.bind(this)}>
    <Text style={styles.lawstext2}>ارسال پیام</Text>
    </TouchableOpacity>
    <View style={{height:90,}}>
    </View>

    </View>
  </View>
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
    <View style={styles.bottombarchild}>
      <View style={styles.bottombarprice}>
        <Text style={styles.pricetext} numberOfLines={1}>{this.state.room.price} تومان</Text>
      </View>
      <View style={styles.bottombarbutton}>
      <TouchableOpacity style={styles.buttontouch} onPress={this.onRequestBookButtonPress.bind(this)}>
      <View style={styles.buttonview}>
      <Text style={styles.reservebuttontext}>رزرو کنید!</Text>
      </View>
      </TouchableOpacity>
      </View>
    </View>
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
        <View style={styles.buttonview1}>
        <Text style={styles.reservebuttontext}>ورود</Text>
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
        <View style={styles.buttonview1}>
        <Text style={styles.reservebuttontext}>ورود</Text>
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
  container2: {
    flex:1,
    flexDirection:'column',
    width: Dimensions.get('window').width - 50,
    flexWrap: 'wrap',
  },
  housename: {
    fontSize:28,
    fontFamily:"Vazir-Medium",
    marginTop:22,
    color:"#4f4f4f"
  },
  city: {
    flexDirection:'row-reverse',
    justifyContent:'flex-start',
  },
  city1: {
    fontSize: 16,
    fontFamily:'Vazir',
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
    borderRadius: 50,
    width: 75,
    marginLeft: 15,
  },
  housemodel: {
    fontSize: 16,
    fontFamily:'Vazir-Medium',
  },
  hostname: {
    flexDirection:'row-reverse',
    alignItems: "flex-end",
    justifyContent:"space-around",
  },
  hostnamestatic: {
    fontSize: 16,
    fontFamily:'Vazir-Light',
    color:"#4f4f4f"
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
    fontFamily:'Vazir-Light',
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
    justifyContent:"center",
  },
  detailicontextbox: {
    flexDirection:'row-reverse',
    marginLeft:28,
    marginRight:28,
    marginBottom:15,
  },
  detailicontext: {
    fontSize: 14,
    fontFamily:'Vazir',
    color:"#9e9e9e",
  },
  deatilitembox:{
    alignItems:'center',
  },
h2:{  fontSize: 18,
  fontFamily:'Vazir-Medium',
  color:"#3e3e3e",
},
explanation: {
  fontSize: 14,
  fontFamily:'Vazir-Light',
  color:"#3e3e3e",
},
mapstyle: {
width: Dimensions.get('screen').width,
resizeMode: 'contain' ,
},
features: {
  flexWrap: 'wrap',
  flexDirection: "row-reverse",
  alignItems: "flex-start",
  marginTop:10,
},
featuresicon: {
  width:30,
  height:30,
  resizeMode: 'contain' ,
  marginLeft: 10,
},
seemore: {
  fontSize: 20,
  fontFamily:"Vazir",
  color: "#00b1ce"
},
bottombar: {
  width: Dimensions.get('screen').width,
  height:65,
  backgroundColor: "#fafafa",
  alignItems: "center",
  justifyContent:"center",
  elevation:9,

},
bottombarchild: {
  width: Dimensions.get('screen').width-50,
  flex:1,
  flexDirection: "row-reverse",
},
bottombarprice: {
  flex:3,
  flexDirection:"row-reverse",
  justifyContent:"center",
  alignItems:'center',
  marginBottom:5,
},
bottombarbutton: {
  flex: 2,
  alignItems:'center',
  justifyContent:"center",
},
pricetext: {
  fontSize: 18,
  fontFamily:"Vazir-Medium",
  color: "#3e3e3e",
  justifyContent: "center",
  alignItems: "center",
},
pernighttext: {
  fontSize: 20,
  fontFamily:"Vazir-Medium",
  color: "#787878",
  justifyContent:"center",
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
  borderColor:"#f56e4e",
  borderRadius: 50,
  borderWidth : 2,
  height:48,
  width: 148,
  flexDirection: "row-reverse",
  justifyContent:"center",
  alignItems:"center",
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
buttonview: {
  backgroundColor:"#f56e4e",
  borderRadius: 50,
    height:40,
    width: 140,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
},
checkinbox:{
  flexDirection: "row-reverse",
  alignItems: "flex-start",
},
checktime:{
  fontSize: 18,
  fontFamily:'Vazir-Medium',
  color:"#3e3e3e",
  marginLeft:8,
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
    fontFamily:'Vazir-Light',
    color:"#3e3e3e",
    marginRight:2,
    alignItems:"center",
    justifyContent:"center",
},
contacthost: {
  flexDirection: "row-reverse"
},
lawstext1: {
  fontSize: 18,
  fontFamily:'Vazir-Medium',
  color:"#3e3e3e",
  marginLeft:5,
},
lawstext2: {
  fontSize: 18,
  fontFamily:'Vazir-Medium',
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
map: {
  ...StyleSheet.absoluteFillObject,
},
popup:{
  backgroundColor:  'rgba(0,0,0,0.82)',
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
},
popuptext:{
  color:'white',
  fontFamily:'Vazir-Medium',
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
});

export default HouseDetail;
