import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Image,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import CacheStore from 'react-native-cache-store';
import Calendar from './common/calendar/Calendar';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { productionURL } from './data';
import NumberSelectScreen from './NumberSelectScreen';


class RequestBookScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      token: null,
      room: {},
      startDate: null,
      startDateText: null,
      startWeekdayText: null,
      endDate: null,
      endDateText: null,
      endWeekdayText: null,
      hostPrice: null,
      trypinnServicePrice: null,
      totalPrice: null,
      trypinnServiceDiscount: null,
      totalDiscount: null,
      discountCode: null,
      numberOfGuests: null,
      newCapacity: null,
      capacityModalVisible: false,
      unAvailableError: false,
      capacityError: false,
      discountCodeError: false,
    };
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

  componentWillMount () {
    this.setState({ room: this.props.navigation.state.params.room });
    CacheStore.get('token').then((value) => this.setToken(value));
  }

  setToken (token) {
    this.setState({
      token
    });
  }

  setDiscountCode =  (input) => {
    this.setState({
      discountCode: input
    });
  }

  confirmDate({startDate, endDate,
      startDateText, startWeekdayText, endDateText, endWeekdayText}) {
    this.setState({
      startDate,
      endDate,
      startDateText,
      startWeekdayText,
      endDateText,
      endWeekdayText,
    }, () => {
      this.updatePrice();
    });
  }

  openCalendar() {
    this.calendar && this.calendar.clear();
    this.calendar && this.calendar.open();
  }

  _onBackButtonPress () {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  }

  _onCapacityChoosePress () {
    this.setState({
      capacityModalVisible: true,
    });
  }

  setCapacityModalVisible (visible) {
    this.setState({
      capacityModalVisible: visible,
    });
  }

  renderCapacityModalRow (value) {
    return(
      <View style={styles.capacityRowStyle}>
       <Text style={styles.capacityRowTextStyle}>{value} نفر</Text>
      </View>
    );
  }

  renderCapacity () {
    if (this.state.numberOfGuests != null) {
      return(
        <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}> مسافر</Text>
          <Text style={styles.resulttext}>{this.state.numberOfGuests}</Text>
        </View>
      );
    }
  }

  updatePrice () {
    if ((this.state.startDate != null) && (this.state.endDate != null)) {
      fetch(productionURL + '/api/room/get_price/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          room_id: this.state.room.id,
          start_date: this.state.startDate.toISOString(),
          end_date: this.state.endDate.toISOString(),
          number_of_guests: this.state.numberOfGuests,
          discount_code: this.state.discountCode,
        }),
      })
      .then((response) => this.onUpdatePriceResponseRecieved(response))
      .catch((error) => {
        Alert.alert('لطفا از اتصال خود به اینترنت مطمئن شوید.');
      });
    }
  }

  onUpdatePriceResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        hostPrice: body.host_price,
        totalPrice: body.total_price,
        trypinnServicePrice: body.trypinn_service_price,
        trypinnServiceDiscount: body.trypinn_service_discount,
        totalDiscount: body.total_discount,
        unAvailableError: !body.is_available,
        discountCodeError: body.discount_code_error,
      });
    } else {
      // TODO
      // error handling
    }
  }

  onSelectCapacity = (value) => {
    this.setState({
      newCapacity: value,
    });
  }

  onConfirmCapacity = () => {
    this.setState({
      numberOfGuests: this.state.newCapacity,
    }, () => {
      this.updatePrice();
    });
    if (this.state.newCapacity > this.state.room.capacity) {
      this.setState({
        capacityError: true,
      });
    } else {
      this.setState({
        capacityError: false,
      });
    }
    this.setCapacityModalVisible(false);
  }

  onCancelCapacity = () => {
    this.setState({
      newCapacity: this.state.numberOfGuests,
    });
    this.setCapacityModalVisible(false);
  }

  _onCheckDiscountCodeButtonPress () {
    if ((this.state.startDate != null) && (this.state.endDate != null)) {
      if (this.state.discountCode != null) {
        fetch(productionURL + '/api/room/get_price/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.state.token,
          },
          body: JSON.stringify({
            room_id: this.state.room.id,
            start_date: this.state.startDate.toISOString(),
            end_date: this.state.endDate.toISOString(),
            number_of_guests: this.state.numberOfGuests,
            discount_code: this.state.discountCode,
          }),
        })
        .then((response) => this.onUpdatePriceResponseRecieved(response))
        .catch((error) => {
          Alert.alert('لطفا از اتصال خود به اینترنت مطمئن شوید.');
        });
      } else {
        Alert.alert('لطفا کد تخفیف خود را وارد نمایید.');
      }
    } else {
      Alert.alert('لطفا زمان سفر خود را انتخاب نمایید.');
    }
  }

  resetNavigation () {
    CacheStore.set('GuestScreen_tabName', 'inboxScreen');
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'guestScreen',
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  onRequestBookButtonPress () {
    if ((this.state.startDate != null) &&
    (this.state.endDate != null) && (this.state.numberOfGuests != null)) {
      fetch(productionURL + '/api/room/request/book/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + this.state.token,
        },
        body: JSON.stringify({
          room_id: this.state.room.id,
          start_date: this.state.startDate.toISOString(),
          end_date: this.state.endDate.toISOString(),
          number_of_guests: this.state.numberOfGuests,
          discount_code: this.state.discountCode,
        }),
      })
      .then((response) => this.onRequestBookResponseRecieved(response))
      .catch((error) => {
        Alert.alert('لطفا از اتصال خود به اینترنت مطمئن شوید.');
      });
    } else {
      Alert.alert('لطفا زمان و تعداد افراد سفر را تعیین نمایید.');
    }
  }

  onRequestBookResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        hostPrice: body.host_price,
        totalPrice: body.total_price,
        trypinnServicePrice: body.trypinn_service_price,
        trypinnServiceDiscount: body.trypinn_service_discount,
        totalDiscount: body.total_discount,
        unAvailableError: !body.is_available,
        discountCodeError: body.discount_code_error,
      });
      if (body.is_requested) {
        // this._onBackButtonPress();
        this.resetNavigation();
        Alert.alert('درخواست با موفقیت ارسال شد.');
      }
    } else {
      // TODO
      // error handling
    }
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

  renderTrypinnShare () {
    if (this.state.trypinnServicePrice != null) {
      return(
        <View style={styles.cost0}>
          <View style={styles.cost1}>
            <Text style={styles.costtext}>حق سرویس تریپین:  </Text>
          </View>
          <View style={styles.cost2}>
            <Text style={styles.costtext}>
              {this.renderPrice(String(this.state.trypinnServicePrice))}
            </Text>
            <Text style={styles.costtext}> تومان</Text>
          </View>
        </View>
      );
    }
  }

  renderTotalPrice () {
    if (this.state.totalPrice != null) {
      return(
        <View style={styles.cost0}>
          <View style={styles.cost1}>
            <Text style={styles.costtext}>جمع هزینه‌ها:</Text>
          </View>
          <View style={styles.cost2}>
            <Text style={styles.costtext}>
              {this.renderPrice(String(this.state.hostPrice + this.state.trypinnServicePrice))}
            </Text>
            <Text style={styles.costtext}> تومان</Text>
          </View>
        </View>
      );
    }
  }

  renderHostPrice () {
    if (this.state.totalPrice != null) {
      return(
          <View style={styles.cost0}>
            <View style={styles.cost1}>
              <Text style={styles.costtext}>هزینه‌ی اقامت:</Text>
            </View>
            <View style={styles.cost2}>
              <Text style={styles.costtext}>
                {this.renderPrice(String(this.state.hostPrice))}
              </Text>
              <Text style={styles.costtext}> تومان</Text>
            </View>
        </View>
      );
    }
  }

  renderDiscount () {
    if (this.state.totalDiscount != null) {
      if (this.state.trypinnServiceDiscount != null) {
        return(
          <View>
            <View style={styles.discountresult}>
              <Text style={styles.distext}>مبلغ تخفیف :  </Text>
              <Text style={styles.distext}>
                {this.renderPrice(String(this.state.totalDiscount))}
              </Text>
              <Text style={styles.distext}> تومان</Text>
            </View>
            <View style={styles.discountdetail}>
              <Text style={styles.disdetatiltext}>
                مبلغ
                {this.renderPrice(String(this.state.totalDiscount))}
                تومان
                شامل
                {this.renderPrice(String(this.state.trypinnServiceDiscount))}
                تومان از حق سرویس
                تریپین به صورت
                تخفیف به شما هدیه
                می‌گردد.
              </Text>
            </View>
          </View>
        );
      } else {
        return(
          <View>
            <View style={styles.discountresult}>
              <Text style={styles.distext}>مبلغ تخفیف :  </Text>
              <Text style={styles.distext}>
                {this.renderPrice(String(this.state.totalDiscount))}
              </Text>
              <Text style={styles.distext}> تومان</Text>
            </View>
          </View>
        );
      }
    }
  }

  renderDiscountIcon () {
    if (Number(this.state.totalDiscount) > 0) {
      return(
        <Icon size={26} color="#29daaa" name="check-circle" />
      );
    } else if (this.state.discountCodeError == false) {
      return(
        <Icon size={26} color="#959595" name="add-circle" />
      );
    } else {
      return(
        <Icon size={26} color="#ff6f4d" name="error" />
      );
    }
  }

  renderUnavailableError () {
    if (this.state.unAvailableError) {
      return(
        <View style={styles.discountdetail}>
          <Text style={styles.disdetatiltext}>
            متاسفانه این خانه برای این زمان قابل رزرو نمی‌باشد.
          </Text>
        </View>
      );
    }
  }

  renderCapacityError () {
    if (this.state.capacityError) {
      return(
        <View style={styles.discountdetail}>
          <Text style={styles.disdetatiltext}>
            ظرفیت این خانه
            {this.state.room.capacity}
            نفر می‌باشد.
          </Text>
        </View>
      );
    }
  }

  renderDiscountCodeError () {
    if (this.state.discountCodeError) {
      return(
        <View style={styles.discountdetail}>
          <Text style={styles.disdetatiltext}>
            متاسفانه کد تخفیف شما معتبر نمی‌باشد.
          </Text>
        </View>
      );
    }
  }

  renderStartDate () {
    if (this.state.startDate != null) {
      return(
        <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}> {this.state.startDateText} </Text>
          <Text style={styles.resulttext}> {this.state.startWeekdayText} </Text>
          <Text style={styles.resulttext}> از </Text>
        </View>
      );
    }
  }

  renderEndDate () {
    if (this.state.endDate != null) {
      return(
        <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}> {this.state.endDateText} </Text>
          <Text style={styles.resulttext}> {this.state.endWeekdayText} </Text>
          <Text style={styles.resulttext}> تا </Text>
        </View>
      );
    }
  }

  renderTripDuration () {
    if ((this.state.startDate != null) && (this.state.endDate != null)) {
      var oneDay = 24*60*60*1000;
      return(
        <View style={styles.interpersonresult}>
          <Text style={styles.resulttext}> روز اقامت </Text>
          <Text style={styles.resulttext}>
            {Math.round(Math.abs(this.state.endDate - this.state.startDate)/oneDay)}
          </Text>
        </View>
      );
    }
  }

  renderFinalPrice () {
    if (this.state.totalPrice != null) {
      return(
        <View style={styles.bottombar}>
          <View style={styles.bottombarchild}>
                <Text style={styles.mablaghtext}> مبلغ نهایی:</Text>
                <View style={styles.bottombarprice}>
                      <Text style={styles.pricetext}>
                        {this.renderPrice(String(this.state.totalPrice))}
                      </Text>
                      <Text style={styles.pricetext}> تومان</Text>
                </View>
            <View style={styles.bottombarbutton}>
                <TouchableOpacity
                  style={styles.buttontouch}
                  onPress={this.onRequestBookButtonPress.bind(this)}>
                  <View style={styles.buttonview}>
                  <Text style={styles.reservebuttontext}>ارسال درخواست</Text>
                </View>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  render () {
    let customI18n = {
      'w': [
        '',
        <Text style={{fontFamily: "Vazir",}}>یک</Text>,
        <Text style={{fontFamily: "Vazir",}}>دو</Text>,
        <Text style={{fontFamily: "Vazir",}}>سه</Text>,
        <Text style={{fontFamily: "Vazir",}}>چهار</Text>,
        <Text style={{fontFamily: "Vazir",}}>پنج</Text>,
        <Text style={{fontFamily: "Vazir",}}>جمعه</Text>,
        <Text style={{fontFamily: "Vazir",}}>شنبه</Text>],
      'weekday': [
        '',
        <Text style={{fontFamily: "Vazir",}}>یک‌شنبه</Text>,
        <Text style={{fontFamily: "Vazir",}}>دوشنبه</Text>,
        <Text style={{fontFamily: "Vazir",}}>سه‌شنبه</Text>,
        <Text style={{fontFamily: "Vazir",}}>چهارشنبه</Text>,
        <Text style={{fontFamily: "Vazir",}}>پنج‌شنبه</Text>,
        <Text style={{fontFamily: "Vazir",}}>جمعه</Text>,
        <Text style={{fontFamily: "Vazir",}}>شنبه</Text>],
      'text': {
        'start': <Text style={{fontFamily: "Vazir",}}>تاریخ شروع</Text>,
        'end': <Text style={{fontFamily: "Vazir",}}>تاریخ پایان</Text>,
        'date': <Text style={{fontFamily: "Vazir",}}>تاریخ</Text>,
        'save': <Text style={{fontFamily: "Vazir",}}>تایید</Text>,
        'clear': <Text style={{fontFamily: "Vazir",}}>ریست کردن</Text>,
      },
      'date': 'jYYYY/jM/jD'  // date format
    };
    // optional property, too.
    let color = {
      mainColor: '#0ca6c1'
    };

    return(
      <View style={styles.container0}>
        <StatusBar
          backgroundColor="#0094ae"
          barStyle="light-content"
        />
        <View style={styles.header0}>
          <View style={styles.header00}>
            <TouchableOpacity onPress={this._onBackButtonPress.bind(this)}>
                <Icon size={28} color="#ffffff" name="arrow-forward" />
            </TouchableOpacity>
            <Text style={styles.h1}>ورود جزییات سفر</Text>
            <View style={{width:28}}></View>
          </View>
        </View>
      <KeyboardAwareScrollView>
        <View style={styles.housebox0}>
            <View style={styles.housebox}>
              <Image
                style={styles.image}
                source={{
                  uri: productionURL + this.state.room.preview
                }} />
              <View>
                <Text style={styles.h2}>{this.state.room.title}</Text>
                <Text style={styles.h3}>{this.state.room.address}</Text>
              </View>
            </View>
        </View>
        <View style={{alignItems:'center',marginTop:20,}}>
          <View style={styles.container1}>
            <TouchableOpacity onPress={this._onCapacityChoosePress.bind(this)}>
              <View style={styles.interperson1}>
                <View style={styles.plusicon}>
                  <Icon size={32} color="#00cecc" name="add-circle" />
                </View>
                <Text style={styles.addtext}>انتخاب تعداد افراد</Text>
              </View>
            </TouchableOpacity>
            {this.renderCapacity()}
            {this.renderCapacityError()}
              <View style={styles.divider}>
              </View>
            <TouchableOpacity onPress={this.openCalendar}>
              <View style={styles.interperson1}>
                  <View style={styles.plusicon}>
                    <Icon size={32} color="#00cecc" name="add-circle" />
                    </View>
                    <Text style={styles.addtext}>انتخاب تاریخ ورود و خروج</Text>
                  </View>
            </TouchableOpacity>
            {this.renderTripDuration()}
            {this.renderStartDate()}
            {this.renderEndDate()}
            {this.renderUnavailableError()}
            <View style={styles.divider}>
            </View>
            <View style={styles.costbox}>
              {this.renderHostPrice()}
              {this.renderTrypinnShare()}
              {this.renderTotalPrice()}
              <View style={styles.interdiscount}>
                {this.renderDiscountIcon()}
                <Text style={styles.costtext}> ورود کد تخفیف : </Text>
                <View style={styles.inputstyle}>
                    <TextInput
                      style={styles.textInput}
                      placeholderTextColor="#acacac"
                      placeholder='oooooooooooo'
                      maxLength = {13}
                      onChangeText={this.setDiscountCode} />
                </View>
                <TouchableOpacity onPress={this._onCheckDiscountCodeButtonPress.bind(this)}>
                  <Text style={styles.checkcodetext}>بررسی</Text>
                </TouchableOpacity>
              </View>
              {this.renderDiscount()}
              {this.renderDiscountCodeError()}
            </View>
            <View style={styles.buttombox}>
            </View>
          </View>
        </View>
        </KeyboardAwareScrollView>

        {this.renderFinalPrice()}

        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.capacityModalVisible}
          onRequestClose={() => {
            this.onCancelCapacity();
          }}>
         <NumberSelectScreen
           capacity={this.state.numberOfGuests}
           onSelect={this.onSelectCapacity}
           onConfirm={this.onConfirmCapacity}
           onCancel={this.onCancelCapacity}>
         </NumberSelectScreen>
        </Modal>

        <View>
          <Calendar
            i18n="en"
            ref={(calendar) => {this.calendar = calendar;}}
            customI18n={customI18n}
            color={color}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onConfirm={this.confirmDate} />
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
    backgroundColor:'#f9f9f9',
  },
  container1: {
    flex: 1,
    flexDirection:'column',
    width: Dimensions.get('window').width-36,
    marginBottom:15,

  },
  housebox0:{
    alignItems:'center',
    backgroundColor:'white',
    borderBottomWidth:0.5,
    borderColor:'#e1e1e1',
    width: Dimensions.get('window').width,
    justifyContent:'center',
  },
  housebox:{
    flex:1,
    flexDirection:'row-reverse',
    height:120,
    width:Dimensions.get('window').width-36 ,
    justifyContent:"flex-start",
    marginTop:5,
    marginRight:18,
  },
  h1:{
    fontSize:20,
    fontFamily:'Vazir-Medium',
    color:'#ffffff',
  },
  h2:{
    fontSize:16,
    fontFamily:'Vazir-Medium',
    color:'#000000',
    marginRight:10,
    marginTop:8,

  },
  interperson:{
    marginTop: 40,
    alignItems:'center',
  },
  interperson1:{
    flexDirection:'row-reverse',
    alignItems:'flex-start',
    width:Dimensions.get('window').width-36 ,

  },
  addtext:{
    color:'#00a9a6',
    fontFamily: 'Vazir-Medium',
    fontSize:18,
    marginRight:5,
  },
  interpersonresult:{
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  resulttext:{
    fontFamily: 'Vazir-Light',
    fontSize:14,
    color:'#000000',
  },
  divider:{
    height:1,
    width:Dimensions.get('window').width-36,
    backgroundColor:'#d7d7d7',
    marginTop:12,
    marginBottom:12,
  },
  costbox:{
    alignItems:'flex-end',
  },
  cost0:{
    flexDirection:'row-reverse',
    width:Dimensions.get('window').width-50 ,
    justifyContent:'space-between',
    marginBottom:5,
  },
  cost1:{
    alignItems:'flex-start',
    flexDirection:'row-reverse',
  },
  cost2:{
    alignItems:'flex-start',
    flexDirection:'row-reverse',
  },
  tripincatch:{
    flexDirection:'row-reverse',
    alignItems: 'flex-start',
  },
  costtext:{
    fontFamily:'Vazir-Light',
    fontSize:14,
    color:'#000000',
  },
  interdiscount: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountresult:{
    flexDirection:'row-reverse',
    alignItems:'flex-end',
    justifyContent:'flex-end',
  },
  distext:{
    fontFamily:'Vazir-Medium',
    fontSize:14,
    color:'#f56e4e',
  },
  disdetatiltext:{
    fontFamily:'Vazir-Light',
    fontSize:12,
    color:'#f56e4e',
  },
  bottombar: {
    width: Dimensions.get('screen').width,
    height:56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent:"center",
    elevation:5,
  },
  bottombarchild: {
    width: Dimensions.get('screen').width-50,
    flex:1,
    flexDirection: "row-reverse",
    marginRight:15,
    },
  bottombarprice: {
    flex:3,
    flexDirection:"row-reverse",
    justifyContent:"flex-start",
    alignItems:'center',
    marginBottom:3,
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
  mablaghtext:{
    fontSize: 12,
    fontFamily:"Vazir-Light",
    color: "#3e3e3e",
    marginTop:6,
  },
  pernighttext: {
    fontSize: 20,
    fontFamily:"Vazir-Medium",
    color: "#787878",
    justifyContent:"flex-end",
    marginTop:2,
  },
  reservebuttontext: {
    fontSize: 17,
    fontFamily:"Vazir-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  buttontouch: {
    borderColor:"#00cecc",
    borderRadius: 50,
    borderWidth : 2,
    height:46,
    width: 148,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  buttonview: {
    backgroundColor:"#00cecc",
    borderRadius: 50,
    height:38,
    width: 139,
    alignItems:"center",
    justifyContent:"center",
    flexDirection: "row-reverse",
  },
  checkcodetext:{
    fontFamily:'Vazir-Light',
    fontSize:14,
    color:'#00a8a6',
  },
  textInput:{
    height:40,
    width:105,
    fontSize: 14,
    fontFamily: 'Vazir',
    textAlign: 'center',
    color: '#4f4f4f',
    marginTop:5,
  },
  inputstyle:{
    marginLeft:5,
    marginRight:5,
  },
  backbuttonview:{
    flexDirection:'row-reverse',
    marginTop:14,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputModalStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: "Vazir",
    fontSize: 20,
    color: '#0ca6c1',
  },
  capacityModalStyle: {
    height: 50,
    width: Dimensions.get('screen').width / 2,
    borderWidth: 0.5,
    borderColor: '#0ca6c1',
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    height: 50,
    backgroundColor: '#0ca6c1',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    fontFamily: "Vazir",
    fontSize: 20,
    color: 'white',
  },
  capacityRowStyle: {
    height: 50,
    width: Dimensions.get('screen').width / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capacityRowTextStyle: {
    fontFamily: "Vazir",
    fontSize: 20,
    color: '#0ca6c1',
  },
  header0:{
    backgroundColor:'#0ca6c1',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:5,
  },
  h3:{
    fontSize:14,
    fontFamily:'Vazir-Light',
    color:'#000000',
    marginRight:10,
  },
  header00:{
    width: Dimensions.get('window').width-40,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:5,
  },
  image: {
    height: 90,
    width: 90,
    resizeMode: "cover",
    marginTop: 15,
  },
});

export default RequestBookScreen;
