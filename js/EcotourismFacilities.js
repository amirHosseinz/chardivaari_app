import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


class EcotourismFacilities extends Component {

  renderRefrig () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('FRIDGE') > -1) {
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
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('PARKING') > -1) {
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

  renderGuestInsurance () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('GUEST_INSURANCE') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/insurance.png')} />
            <Text style={styles.Facilityname}>
              بیمه مسافر
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderKorsi () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('KORSI') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/korsi.png')} />
            <Text style={styles.Facilityname}>
              کرسی
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderHerbaltea () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('HERBAL_TEA') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/herbal_tea.png')} />
            <Text style={styles.Facilityname}>
              دمنوش
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderCanape () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('SOFA') > -1) {
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
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('DINING_TABLE') > -1) {
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
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('COOLER') > -1) {
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

  renderHeater () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('HEATER') > -1) {
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

  renderWashingMachine () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('WASHING_MACHINE') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/washing_machine.png')} />
          <Text style={styles.Facilityname}>
            ماشین لباسشویی
          </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderKitchenware () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('COOKING_UTILS') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/kitchenware.png')} />
            <Text style={styles.Facilityname}>
              ظروف آشپزخانه
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderStove () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('OVEN') > -1) {
      return(
        <View>
        <View style={styles.container2}>
          <Image style={styles.icon} source={require('./img/facilities/stove.png')} />
          <Text style={styles.Facilityname}>
            اجاق گاز
          </Text>
        </View>
        <View style={styles.divider}>
        </View>
        </View>
      );
    }
  }

  renderTv () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('TV') > -1) {
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

  renderMobileCoverage () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('MOBILE_NETWORK_COVEREGE') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/mobile_tower.png')} />
            <Text style={styles.Facilityname}>
              آنتن‌دهی موبایل
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    }
  }

  renderForeigntoilet () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('SHARED_FOREIGN_TOILET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
            <Text style={styles.Facilityname}>
              توالت فرنگی مشترک
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    } else if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('ENTIRE_FOREIGN_TOILET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-1.png')} />
            <Text style={styles.Facilityname}>
              توالت فرنگی
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

  renderIranitoilet () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('SHARED_TOILET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}>
              توالت ایرانی مشترک
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    } else if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('ENTIRE_TOILET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}>
              توالت ایرانی
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

  renderBathroom () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('SHARED_BATHROOM') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}>
              حمام اشتراکی
            </Text>
          </View>
          <View style={styles.divider}>
          </View>
        </View>
      );
    } else if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('ENTIRE_BATHROOM') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wc-2.png')} />
            <Text style={styles.Facilityname}>
              حمام
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

  renderWifi () {
    if (this.props.room.general_utils_options && this.props.room.general_utils_options.indexOf('NET') > -1) {
      return(
        <View>
          <View style={styles.container2}>
            <Image style={styles.icon} source={require('./img/facilities/wifi.png')} />
            <Text style={styles.Facilityname}>
              اینترنت
            </Text>
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
            <View style={{
              marginTop: 10,
            }}></View>
            {this.renderRefrig()}
            {this.renderWifi()}
            {this.renderParking()}
            {this.renderKorsi()}
            {this.renderHerbaltea()}
            {this.renderCanape()}
            {this.renderConditioner()}
            {this.renderDinnerTable()}
            {this.renderHeater()}
            {this.renderWashingMachine()}
            {this.renderKitchenware()}
            {this.renderStove()}
            {this.renderTv()}
            {this.renderBathroom()}
            {this.renderForeigntoilet()}
            {this.renderIranitoilet()}
            {this.renderGuestInsurance()}
            {this.renderMobileCoverage()}
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

export default EcotourismFacilities;
