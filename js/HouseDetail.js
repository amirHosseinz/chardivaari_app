import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Stars from 'react-native-stars';
import Button from 'apsl-react-native-button';
import ImageSlider from 'react-native-image-slider';
import StarRating from 'react-native-star-rating';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CacheStore from 'react-native-cache-store';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { testURL, productionURL } from './data';

class HouseDetail extends Component {

  constructor(props) {
   super(props);
   this.state = {
     token: '',
     username: '',
     room: null,
     region: null,
     marker: null,
   };
   this.mapStyle = [];
 }

 onRegionChange(region) {
   this.setState({ region });
 }

 componentWillMount() {
   this.setState({ room: this.props.navigation.state.params.room });

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

   CacheStore.get('token').then((value) => this.setToken(value));
   CacheStore.get('username').then((value) => this.setUsername(value));
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

 onPressContactHost () {
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
       body: ' درخواست صحبت درباره‌ی خانه‌ی ' + this.state.room.title,
     }),
   })
   .then((response) => this.onResponseRecieved(response))
   .catch((error) => {
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

 onRequestBookButtonPress () {
  //  this.props.navigation.navigate(
  //    'requestBook',{roomId: this.state.room.id}
  //  );
   this.props.navigation.navigate(
     'requestBookScreen',{room: this.state.room}
   );
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
    if (this.state.room.private_util_options.indexOf('BREAKFAST') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/breakfast.png")}/>
      );
    }
  }

  renderTVFeature () {
    if (this.state.room.private_util_options.indexOf('TV') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/tv.png")}/>
      );
    }
  }

  renderWifiFeature () {
    if (this.state.room.private_util_options.indexOf('NET') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/wifi.png")}/>
      );
    }
  }

  renderHangerFeature () {
    if (this.state.room.private_util_options.indexOf('HANGER') > -1) {
      return(
        <Image style={styles.featuresicon} source={require("./img/hanger.png")}/>
      );
    }
  }

  renderWashingMachineFeature () {
    if (this.state.room.private_util_options.indexOf('WASHING_MACHINE') > -1) {
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

  imageSliderFeed () {
    result = [];
    result.push(productionURL + this.state.room.preview);
    for (var i = 0; i < this.state.room.images.length; i++) {
      result.push(productionURL + this.state.room.images[i].image);
    }
    return (result);
  }

  renderProfilePicture () {
    if (this.state.room.owner.profile_picture == null) {
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
    return(
      <Image style={styles.accountimage} source={{
        uri: productionURL + this.state.room.owner.profile_picture
      }}/>
    );
  }

  renderTimeField (timeField) {
    return (timeField.substr(0, 5));
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
      showsHorizontalScrollIndicator={false}
      >
      <ImageSlider images={this.imageSliderFeed()}
      height={280}
      />

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
    <Text style={styles.hostnamedynamic}>{this.state.room.owner.first_name} {this.state.room.owner.last_name}</Text>
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
    <TouchableOpacity>
      <Text style={styles.seemore}>مشاهده بیشتر</Text>
    </TouchableOpacity>
    </View>
</View>
</View>

<View style={styles.container0}>
<View style={styles.container2}>

<View style={styles.divider}>
</View>
<View style={styles.mapContainer}>

<MapView
  provider={PROVIDER_GOOGLE}
  customMapStyle={this.mapStyle}
  style={styles.map}
  region={this.state.region}
  onRegionChange={this.onRegionChange.bind(this)}>
  <MapView.Circle
    center={this.state.marker.latlng}
    radius={this.state.marker.radius}
    strokeColor={'green'}
    strokeWidth={3}
  />
</MapView>
</View>

<View style={styles.divider}>
</View>
</View>
</View>

<View style={styles.container0}>
  <View style={styles.container2}>
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
    <TouchableOpacity>
      <Text style={styles.laws}>مشاهده تمام قوانین این خانه</Text>
    </TouchableOpacity>
    <View style={styles.divider}>
    </View>
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
</ScrollView>

  <View style={styles.bottombar}>
    <View style={styles.bottombarchild}>
      <View style={styles.bottombarprice}>
      <Text style={styles.pricetext}>{this.state.room.price}</Text>
            <Text style={styles.pricetext}> تومان</Text>
      <Text style={styles.pernighttext}>/ هر شب</Text>
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
  height:80,
  backgroundColor: "#fafafa",
  alignItems: "center",
  justifyContent:"center",
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
  fontSize: 20,
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
laws: {
  fontSize: 18,
  fontFamily:'Vazir-Medium',
  color:"#f56e4e",
  marginTop:5,
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
  width: Dimensions.get('screen').width-40,
},
map: {
  ...StyleSheet.absoluteFillObject,
},
});

export default HouseDetail;
