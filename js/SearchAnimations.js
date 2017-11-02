import React, { Component } from 'react';
import {
  View,
  Button,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  NativeModules,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
 } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Calendar from './common/calendar/Calendar';
import ModalDropdown from 'react-native-modal-dropdown';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

var collapseLayoutAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    // type: LayoutAnimation.Types.curveEaseInEaseOut,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

var expandLayoutAnimation = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    // type: LayoutAnimation.Types.curveEaseInEaseOut,
    type: LayoutAnimation.Types.spring,
  },
};

class SearchAnimations extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      destination: 'هر کجا',
      newDestination: 'هر کجا',
      dateText: 'هر زمان',
      capacity: 1,
      newCapacity: 1,
      capacityModalVisible: false,
      whereModalVisible: false,
      myStyle: {
        height: 80,
         flexDirection: 'column',
         alignItems: 'flex-start',
         justifyContent: 'space-around',
         backgroundColor: '#0ca6c1',
         paddingTop: 5,
         elevation:3
      },
      srartDate: null,
      newStartDate: null,
      endDate: null,
      newEndData: null,
    };
    this.confirmDate = this.confirmDate.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
  }

     expandElement = () => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        // LayoutAnimation.configureNext(expandLayoutAnimation);
        this.setState({
           myStyle: {
              backgroundColor: '#0ca6c1',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: 5,
              paddingBottom: 5,
              elevation:3

           },
           isOpen: true,
        });
     }

     collapseElement = () => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        LayoutAnimation.configureNext(collapseLayoutAnimation);
        this.setState({
          isOpen: false,
           myStyle: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              backgroundColor: '#0ca6c1',
              paddingTop: 5,
              paddingBottom:10,
              elevation:3

           }
        });
     }

     renderTripDuration () {
       if ((this.state.startDate != null) && (this.state.endDate != null)) {
         var oneDay = 24*60*60*1000;
         return(Math.round(Math.abs(this.state.endDate - this.state.startDate)/oneDay));
       }
     }

     renderSumText () {
       var sum = '';
       if (this.state.startDate && this.state.endDate) {
         sum = this.renderTripDuration() + 'روزه - ';
       } else {
         sum = this.state.dateText + ' - ';
       }
       sum = sum + this.state.destination + ' - ';
       sum = sum + this.state.capacity + ' نفر';
       return sum;
     }

     renderLesserIcon () {
       if (this.state.isOpen) {
         return(
           <View style={styles.lesserIcon}>
         <View style={styles.iconbox}>
            <Icon
              name='expand-less'
              size={35}
              color='#f7f7f7'
              onPress={this.collapseElement}
            />
         </View>
         </View>
         );
       }
     }

     renderFirst () {
         if (this.state.isOpen === true) {
           return(
             <View style={styles.itemStyle}>
             <TouchableOpacity style={{flex: 1,}} onPress={this.showWhereModal}>
             <View style={styles.innerItemStyle}>
             <Icon
               name='public'
               size={32}
               color='#f7f7f7' />
                <Text style={styles.button}>
                  {this.state.destination}
                </Text>
                </View>
             </TouchableOpacity>
             </View>
           );
         } else {
           return(
             <View style={styles.itemStyle}>
             <TouchableOpacity style={{flex: 1,}} onPress={this.expandElement}>
              <View style={styles.innerItemStyle}>
                <Icon
                  name='search'
                  size={32}
                  color='#f7f7f7' />
                <Text style={styles.button}>
                {this.renderSumText()}
                </Text>
              </View>
             </TouchableOpacity>
             </View>
           );
         }
     }

     showCapacityModal = () => {
       this.setState({
         capacityModalVisible: true,
       });
     }

     showWhereModal = () => {
       this.setState({
         whereModalVisible: true,
       });
     }

     renderRest () {
       if (this.state.isOpen) {
         return(
           <View style={styles.itemStyle}>
           <TouchableOpacity onPress={this.openCalendar} style={{flex: 1,}}>
           <View style={styles.innerItemStyle}>
           <Icon
             name='date-range'
             size={32}
             color='#f7f7f7' />
              <Text style={styles.button}>
                {this.state.dateText}
               </Text>
               </View>
           </TouchableOpacity>
           </View>
         );
       }
     }

     renderThird () {
       if (this.state.isOpen) {
         return(
           <View style={styles.itemStyle}>
           <TouchableOpacity onPress={this.showCapacityModal} style={{flex: 1,}}>
           <View style={styles.innerItemStyle}>
           <Icon
             name='group-add'
             size={32}
             color='#f7f7f7' />
              <Text style={styles.button}>
                {this.state.capacity} نفر
              </Text>
              </View>
           </TouchableOpacity>
           </View>
         );
       }
     }

     setCapacityModalVisible (visible) {
       this.setState({
         capacityModalVisible: visible,
       });
     }

     setWhereModalVisible (visible) {
       this.setState({
         whereModalVisible: visible,
       });
     }

     confirmDate({startDate, endDate, startMoment, endMoment, startDateText, endDateText}) {
       if (startDateText && endDateText) {
         var dateText = 'از ' + startDateText + ' تا ' + endDateText;
       } else {
         var dateText = 'هر زمان';
       }

       if (this.state.startDate === startDate && this.state.endDate === endDate) {
       } else {
         this.setState({
           startDate,
           endDate,
           dateText: dateText,
         });
         this.props.setStartDate(startDate);
         this.props.setEndDate(endDate);
         this.props.doSearchAction();
       }
     }

     openCalendar() {
       this.calendar && this.calendar.clear();
       this.calendar && this.calendar.open();
     }

     onSelectLocation = (index, value) => {
       this.setState({
         newDestination: value,
       });
     }

     onConfirmLocation = () => {
       if (this.state.destination === this.state.newDestination) {
       } else {
         if (this.state.newDestination === 'هر کجا') {
           this.props.setDestination(null);
           this.setState({
             destination: this.state.newDestination,
           });
         } else {
           this.setState({
             destination: this.state.newDestination,
           });
           this.props.setDestination(this.state.newDestination);
         }
         this.props.doSearchAction();
       }
     }

     onCancelLocation = () => {
       this.setState({
         newDestination: this.state.destination,
       });
     }

     onSelectCapacity = (index, value) => {
       this.setState({
         newCapacity: value,
       });
     }

     onConfirmCapacity = () => {
       if (this.state.capacity === this.state.newCapacity) {
       } else {
         this.setState({
           capacity: this.state.newCapacity,
         });
         this.props.setCapacity(this.state.newCapacity);
         this.props.doSearchAction();
       }
     }

     onCancelCapacity = () => {
       this.setState({
         newCapacity: this.state.capacity,
       });
     }

     renderCapacityModalRow (value) {
       return(
         <View style={styles.capacityRowStyle}>
          <Text style={styles.capacityRowTextStyle}>{value} نفر</Text>
         </View>
       );
     }

     renderLocationModalRow (value) {
       return(
         <View style={styles.capacityRowStyle}>
          <Text style={styles.capacityRowTextStyle}>{value}</Text>
         </View>
       );
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
         // 'date': 'MM / DD'
         'date': 'jYYYY/jM/jD'  // date format
       };
       // optional property, too.
       let color = {
         mainColor: '#0ca6c1'
       };

       return (
         <View style={styles.container}>
                 <View style={this.state.myStyle}>
                 {this.renderLesserIcon()}
                 {this.renderFirst()}
                 {this.renderRest()}
                 {this.renderThird()}
                 </View>

                 <Modal
                   animationType='slide'
                   transparent={false}
                   visible={this.state.capacityModalVisible}
                   onRequestClose={() => {
                     this.setCapacityModalVisible(false);
                     this.onCancelCapacity();
                   }}>
                      <View style={styles.modalContainer}>
                      <View style={styles.inputModalStyle}>
                      <ModalDropdown
                        defaultValue={'تعداد نفرات'}
                        showsVerticalScrollIndicator={false}
                        textStyle={styles.optionText}
                        style={styles.capacityModalStyle}
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        renderRow={this.renderCapacityModalRow}
                        onSelect={this.onSelectCapacity}
                      />
                        <TouchableHighlight style={styles.confirmButton} onPress={() => {
                          this.setCapacityModalVisible(!this.state.capacityModalVisible);
                          this.onConfirmCapacity();
                        }}>
                          <Text style={styles.confirmButtonText}>تایید</Text>
                        </TouchableHighlight>
                        </View>
                      </View>
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

                   <Modal
                   animationType='slide'
                   transparent={false}
                   visible={this.state.whereModalVisible}
                   onRequestClose={() => {
                     this.setWhereModalVisible(false);
                     this.onCancelLocation();
                   }}>
                    <View style={styles.modalContainer}>
                    <View style={styles.inputModalStyle}>
                    <ModalDropdown
                      options={this.props.locations}
                      onSelect={this.onSelectLocation}
                      defaultValue={'مقصد سفر'}
                      showsVerticalScrollIndicator={false}
                      textStyle={styles.optionText}
                      style={styles.capacityModalStyle}
                      renderRow={this.renderLocationModalRow}
                    />
                    <TouchableHighlight style={styles.confirmButton} onPress={() => {
                      this.setWhereModalVisible(!this.state.whereModalVisible);
                      this.onConfirmLocation();
                    }}>
                      <Text style={styles.confirmButtonText}>تایید</Text>
                    </TouchableHighlight>
                    </View>
                    </View>
                   </Modal>
           </View>
        );
     }
  }


const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
  },
  button: {
    color: 'white',
    textAlign: 'right',
    fontFamily: "Vazir",
    fontSize: 16,
    marginRight: 5,
    paddingRight: 12,
  },
  itemStyle: {
    width: Dimensions.get('screen').width - 20,
    height: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#4fbdd1',
    padding: 2,
    marginTop: 10,
    marginRight: 14,
    marginLeft: 14,
    borderRadius: 5,
  },
  iconbox: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    paddingRight: 15,
  },
  lesserIcon: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft:15,
  },
  innerItemStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#4fbdd1',
    marginRight: 14,
    marginLeft: 14,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
  optionText: {
    fontFamily: "Vazir",
    fontSize: 20,
    color: '#0ca6c1',
  },
  capacityModalStyle: {
    height: 50,
    width: Dimensions.get('screen').width / 2,
    borderWidth: 0.5,
    borderColor: '#636877',
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputModalStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});

export default SearchAnimations;
