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
  render () {
    return(
          <View style={styles.container0}>
            <View style={styles.container1}>
              <TouchableOpacity onPress={this.props.onClose}>
                <View style={styles.backbuttonview}>
                  <Icon size={44} color="#3e3e3e" name="keyboard-arrow-right" />
                </View>
              </TouchableOpacity>
          <ScrollView
          showsHorizontalScrollIndicator={false}
          >
          <View style={styles.header}>
            <Text style={styles.h1}>لیست کامل امکانات</Text>
          </View>

          <View style={styles.container}>
            <View style={styles.container2}>
              <Image style={styles.icon} source={require('./img/facilities/refrigerator.png')} />
              <Text style={styles.Facilityname}>یخچال فریزر   </Text>
            </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/parking.png')} />
            <Text style={styles.Facilityname}>پارکینگ   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/Barbecue.png')} />
            <Text style={styles.Facilityname}>باربکیو   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/blanket.png')} />
            <Text style={styles.Facilityname}>پتو و بالشت اضافه   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/canape.png')} />
            <Text style={styles.Facilityname}>مبلمان   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/conditioner.png')} />
            <Text style={styles.Facilityname}>کولر   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/dinnertable.png')} />
            <Text style={styles.Facilityname}>میز ناهارخوری   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/elevator.png')} />
            <Text style={styles.Facilityname}>آسانسور   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/foosball.png')} />
            <Text style={styles.Facilityname}>فوتبال دستی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/hanger.png')} />
            <Text style={styles.Facilityname}>چوب لباسی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/heater.png')} />
            <Text style={styles.Facilityname}>بخاری - شوفاژ   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/kitchenware.png')} />
            <Text style={styles.Facilityname}>ظروف آشپزخانه   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/mircowave.png')} />
            <Text style={styles.Facilityname}>ماکروویو   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/pavilion.png')} />
            <Text style={styles.Facilityname}>آلاچیق   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/pingpong.png')} />
            <Text style={styles.Facilityname}>میز پینگ پنگ   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/pool.png')} />
            <Text style={styles.Facilityname}>استخر   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/stove.png')} />
            <Text style={styles.Facilityname}>اجاق گاز   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/teamaker.png')} />
            <Text style={styles.Facilityname}> چای ساز   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/tv.png')} />
            <Text style={styles.Facilityname}> تلویزیون   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
            <Text style={styles.Facilityname}> توالت فرنگی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}> توالت ایرانی   </Text>
          </View>
          <View style={styles.divider}>
          </View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wifi.png')} />
            <Text style={styles.Facilityname}> اینترنت بیسیم  </Text>
          </View>
          </View>

      </ScrollView>
        </View>
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
    width:Dimensions.get('screen').width-50,
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
    fontFamily:'Vazir-Medium',
    color:'#3e3e3e',
    marginTop:16,
    marginBottom:30,
  },
  h2:{
    fontSize:18,
    fontFamily:'Vazir-Thin',
    color:'#3e3e3e',
    marginBottom:30,
  },
  cost:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
},
  divider:{
    height: 2,
    width:Dimensions.get('window').width-50 ,
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
    fontFamily:'Vazir-Light',
    color:'#a2a2a2',
  },
  container:{
    marginBottom:60,
  },
});

export default Facilities;