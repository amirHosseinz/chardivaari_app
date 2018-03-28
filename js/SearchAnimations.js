import React, { Component } from 'react';
import {
  View,
  Button,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  NativeModules,
  Platform,
 } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Calendar from './common/calendar/Calendar';
import LocationSelectScreen from './LocationSelectScreen';
import NumberSelectScreen from './NumberSelectScreen';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const collapseLayoutAnimation = {
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

// var expandLayoutAnimation = {
//   duration: 500,
//   create: {
//     type: LayoutAnimation.Types.easeInEaseOut,
//     property: LayoutAnimation.Properties.opacity,
//   },
//   update: {
//     // type: LayoutAnimation.Types.curveEaseInEaseOut,
//     type: LayoutAnimation.Types.spring,
//   },
// };

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
         flexDirection: 'column',
         alignItems: 'flex-start',
         backgroundColor: '#0ca6c1',
         elevation:3,
         ...Platform.select({
           ios: {
             height: 64,
             justifyContent: 'flex-end',
           },
           android: {
             justifyContent: 'space-around',
             height: 80,
             paddingTop: 5,
           },
         }),
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
              paddingTop: 5,
              paddingBottom: 5,
              elevation:3,
              ...Platform.select({
                ios: {
                  justifyContent: 'flex-end',
                },
                android: {
                  justifyContent: 'space-around',
                },
              }),
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
              backgroundColor: '#0ca6c1',
              elevation:3,
              ...Platform.select({
                ios: {
                  height: 64,
                  justifyContent: 'flex-end',
                },
                android: {
                  justifyContent: 'space-around',
                  paddingBottom:10,
                  paddingTop: 5,
                },
              }),
           }
        });
     }

     renderTripDuration () {
       if ((this.state.startDate != null) && (this.state.endDate != null)) {
         var oneDay = 24*60*60*1000;
         return(Math.round(Math.abs(this.state.endDate - this.state.startDate)/oneDay));
       }
     }

     collapseFromOutside () {
       if (this.state.isOpen) {
         this.collapseElement();
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
         // this.props.doSearchAction();
       }
     }

     openCalendar() {
       this.calendar && this.calendar.clear();
       this.calendar && this.calendar.open();
     }

     onSelectLocation = (value) => {
       this.setState({
         newDestination: value,
       }, () => {
         this.onConfirmLocation();
       });
     }

     onConfirmLocation = () => {
       if (this.state.newDestination === 'هر کجا') {
         this.props.setDestination(null);
         this.setState({
           destination: this.state.newDestination,
         });
       }
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
         // this.props.doSearchAction();
       }
       this.setWhereModalVisible(false);
     }

     onCancelLocation = () => {
       this.setState({
         newDestination: this.state.destination,
       }, () => {
         this.setWhereModalVisible(false);
       });
     }

     onSelectCapacity = (value) => {
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
         // this.props.doSearchAction();
       }
       this.setCapacityModalVisible(false);
     }

     onCancelCapacity = () => {
       this.setState({
         newCapacity: this.state.capacity,
       });
       this.setCapacityModalVisible(false);
     }

     renderCapacityModalRow (value) {
       return(
         <View style={styles.capacityRowStyle}>
          <Text style={styles.capacityRowTextStyle}>{value} نفر</Text>
         </View>
       );
     }

     render () {
       let customI18n = {
         'w': [
           '',
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>یک</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>دو</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>سه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>چهار</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>پنج</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>جمعه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>شنبه</Text>],
         'weekday': [
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>شنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>یک‌شنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>دوشنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>سه‌شنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>چهارشنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>پنج‌شنبه</Text>,
           <Text style={{fontFamily: "IRANSansMobileFaNum",}}>جمعه</Text>],
         'text': {
           'start': <Text style={{
             fontFamily: "IRANSansMobileFaNum",
             fontSize: 20,
           }}>تاریخ ورود</Text>,
           'end': <Text style={{
             fontFamily: "IRANSansMobileFaNum",
             fontSize: 20,
           }}>تاریخ خروج</Text>,
           'date': <Text style={{fontFamily: "IRANSansMobileFaNum",}}></Text>,
           'save': 'تایید',
           'clear': <Text style={{fontFamily: "IRANSansMobileFaNum",}}>پاک</Text>,
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
                     this.onCancelCapacity();
                   }}>
                      <NumberSelectScreen
                        capacity={this.state.capacity}
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

                  <Modal
                   animationType='slide'
                   transparent={false}
                   visible={this.state.whereModalVisible}
                   onRequestClose={() => {
                     this.onCancelLocation();
                   }}>
                    <LocationSelectScreen
                      locations={this.props.locations}
                      onSelect={this.onSelectLocation}
                      onCancel={this.onCancelLocation}>
                    </LocationSelectScreen>
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
    fontFamily: "IRANSansMobileFaNum",
    fontSize: 16,
    marginRight: 5,
    paddingRight: 12,
  },
  itemStyle: {
    width: Dimensions.get('screen').width - 20,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#4fbdd1',
    padding: 2,
    marginRight: 14,
    marginLeft: 14,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        height: 35,
        marginTop: 5,
      },
      android: {
        height: 40,
        marginTop: 10,
      },
    }),
  },
  iconbox: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    paddingRight: 15,
    ...Platform.select({
      ios: {
        paddingTop: 10,
        marginBottom: -15,
      },
    }),
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
    fontFamily: "IRANSansMobileFaNum",
    fontSize: 20,
    color: 'white',
  },
  optionText: {
    fontFamily: "IRANSansMobileFaNum",
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
    fontFamily: "IRANSansMobileFaNum",
    fontSize: 20,
    color: '#0ca6c1',
  },
});

export default SearchAnimations;
