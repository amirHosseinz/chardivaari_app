import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


class Facilities extends Component {

  renderRefrig () {
    if (this.props.room && this.props.room.private_util_options.indexOf('FRIDGE') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/refrigerator.png')} />
            <Text style={styles.Facilityname}>یخچال فریزر   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderParking () {
    if (this.props.room && this.props.room.general_util_options.indexOf('PARKING') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/parking.png')} />
            <Text style={styles.Facilityname}>پارکینگ   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderBarbecue () {
    if (this.props.room && this.props.room.general_util_options.indexOf('BARBECUE') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/Barbecue.png')} />
            <Text style={styles.Facilityname}>باربکیو   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderBlanket () {
    if (this.props.room && this.props.room.private_util_options.indexOf('EXTRA_SLEEP_UTILS') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/blanket.png')} />
            <Text style={styles.Facilityname}>پتو و بالشت اضافه   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderCanape () {
    if (this.props.room && this.props.room.private_util_options.indexOf('SOFA') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/canape.png')} />
            <Text style={styles.Facilityname}>مبلمان   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderDinnerTable () {
    if (this.props.room && this.props.room.private_util_options.indexOf('DINING_TABLE') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/dinnertable.png')} />
            <Text style={styles.Facilityname}>میز ناهارخوری   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderConditioner () {
    if (this.props.room && this.props.room.private_util_options.indexOf('COOLER') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/conditioner.png')} />
            <Text style={styles.Facilityname}>کولر   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderElevator () {
    if (this.props.room && this.props.room.general_util_options.indexOf('ELEVATOR') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/elevator.png')} />
            <Text style={styles.Facilityname}>آسانسور   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderFoosball () {
    if (this.props.room && this.props.room.general_util_options.indexOf('TABLE_FOOTBALL') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/foosball.png')} />
            <Text style={styles.Facilityname}>فوتبال دستی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderHanger () {
    if (this.props.room && this.props.room.private_util_options.indexOf('HANGER') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/hanger.png')} />
          <Text style={styles.Facilityname}>چوب لباسی   </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderHeater () {
    if (this.props.room && this.props.room.private_util_options.indexOf('HEATER') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/heater.png')} />
          <Text style={styles.Facilityname}>بخاری - شوفاژ   </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderKitchenware () {
    if (this.props.room && this.props.room.general_util_options.indexOf('KITCHEN_DISH') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/kitchenware.png')} />
            <Text style={styles.Facilityname}>ظروف آشپزخانه   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderMicrowave () {
    if (this.props.room && this.props.room.private_util_options.indexOf('MICROWAVE_OVEN') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/mircowave.png')} />
            <Text style={styles.Facilityname}>ماکروویو   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderPavilion () {
    if (this.props.room && this.props.room.general_util_options.indexOf('PERGOLA') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/pavilion.png')} />
            <Text style={styles.Facilityname}>آلاچیق   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderPingpong () {
    if (this.props.room && this.props.room.general_util_options.indexOf('PING_PONG') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/pingpong.png')} />
          <Text style={styles.Facilityname}>میز پینگ پنگ   </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderPool () {
    if (this.props.room && this.props.room.general_util_options.indexOf('POOL') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/pool.png')} />
            <Text style={styles.Facilityname}>استخر   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderStove () {
    if (this.props.room && this.props.room.private_util_options.indexOf('OVEN') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/stove.png')} />
          <Text style={styles.Facilityname}>اجاق گاز   </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderTeamaker () {
    if (this.props.room && this.props.room.private_util_options.indexOf('TEA_MAKER') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/teamaker.png')} />
            <Text style={styles.Facilityname}> چای ساز   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderTv () {
    if (this.props.room && this.props.room.private_util_options.indexOf('TV') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/tv.png')} />
            <Text style={styles.Facilityname}> تلویزیون   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderForeigntoilet () {
    if (this.props.room && this.props.room.private_util_options.indexOf('FOREIGN_TOILET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
            <Text style={styles.Facilityname}> توالت فرنگی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderIranitoilet () {
    if (this.props.room && Number(this.props.room.toilets_number) > 0) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}> توالت ایرانی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderWifi () {
    if (this.props.room && this.props.room.private_util_options.indexOf('NET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wifi.png')} />
            <Text style={styles.Facilityname}> اینترنت بیسیم  </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  render () {
    return(
          <View style={styles.container0}>
                  <View style={styles.header0}>
                    <View style={styles.header00}>
                      <TouchableOpacity onPress={this.props.onClose}>
                          <Icon size={28} color="#3e3e3e" name="close" />
                      </TouchableOpacity>
                      <Text style={styles.h01}>امکانات خانه</Text>
                      <View style={{width:28}}></View>
                    </View>
                  </View>
          <ScrollView>
          <View style={{alignItems:'center',width:Dimensions.get('window').width,}}>
          <View style={styles.container}>
            {this.renderRefrig()}
            {this.renderWifi()}
            {this.renderParking()}
            {this.renderBarbecue()}
            {this.renderBlanket()}
            {this.renderCanape()}
            {this.renderConditioner()}
            {this.renderDinnerTable()}
            {this.renderElevator()}
            {this.renderFoosball()}
            {this.renderHanger()}
            {this.renderHeater()}
            {this.renderKitchenware()}
            {this.renderMicrowave()}
            {this.renderPavilion()}
            {this.renderPingpong()}
            {this.renderPool()}
            {this.renderStove()}
            {this.renderTeamaker()}
            {this.renderTv()}
            {this.renderForeigntoilet()}
            {this.renderIranitoilet()}
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
    flexDirection:'column',
    alignItems:'center',
    backgroundColor:'#ffffff',

  },
  container1: {
    flex: 1,
    flexDirection:'column',

  },
  backbuttonview:{
    flexDirection:'row-reverse',
    marginTop:14,
    marginBottom:10,
  },
  header:{
    justifyContent:'center',
    alignItems:'center',
  },
  h1:{
    fontSize:24,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'#3e3e3e',
    marginTop:16,
    marginBottom:30,
  },
  h2:{
    fontSize:18,
    fontFamily:'IRANSansMobileFaNum-Thin',
    color:'#3e3e3e',
    marginBottom:30,
  },
  cost:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
},
  divider:{
    height: 1,
    width:Dimensions.get('window').width-36 ,
    backgroundColor: '#d7d7d7',
    marginTop: 12,
    marginBottom: 12,
  },
  container2:{
    flexDirection:'row-reverse',
    alignItems:'center'
  },
  icon:{
    height:48,
    width:32,
    resizeMode:"contain",
    marginLeft:20,
    overlayColor:'#a2a2a2',
  },
  Facilityname:{
    fontSize:20,
    fontFamily:'IRANSansMobileFaNum-Light',
    color:'#a2a2a2',
  },
  container:{
    marginBottom:60,
    width: Dimensions.get('window').width-36,
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
    fontSize:18,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color:"#3e3e3e",
  },
});

export default Facilities;
