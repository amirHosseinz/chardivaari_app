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
// import Calendar from 'react-native-calendar-select';
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
      capacity: 1,
      capacityModalVisible: false,
      whereModalVisible: false,
      myStyle: {
        height: 80,
         flexDirection: 'column',
         alignItems: 'flex-start',
         justifyContent: 'space-around',
         backgroundColor: '#636877',
         paddingTop: 5,
      },
      srartDate: new Date(),
      endDate: new Date(),
      sum: '',
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
              backgroundColor: '#636877',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingTop: 5,
              paddingBottom: 5,
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
              backgroundColor: '#636877',
              paddingTop: 5,
           }
        });
     }

     renderLesserIcon () {
       if (this.state.isOpen) {
         return(
           <View style={styles.lesserIcon}>
         <View style={styles.iconbox}>
            <Icon
              name='expand-less'
              size={35}
              color='#d5d7dd'
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
               size={35}
               color='#d5d7dd'
             />
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
                  size={35}
                  color='#d5d7dd'
                />
                <Text style={styles.button}>
                {this.state.sum}
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
             size={35}
             color='#d5d7dd'
           />
              <Text style={styles.button}>
              هر زمان
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
             size={35}
             color='#d5d7dd'
           />
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

     confirmDate({startDate, endDate, startMoment, endMoment}) {
       this.setState({
         startDate,
         endDate
       });
       this.props.setStartDate(startDate);
       this.props.setEndDate(endDate);
     }

     openCalendar() {
       this.calendar && this.calendar.clear();
       this.calendar && this.calendar.open();
     }

     onSelectLocation = (index, value) => {
       this.setState({
         destination: value,
       });
       this.props.setDestination(value);
     }

     onSelectCapacity = (index, value) => {
       this.setState({
         capacity: value,
       });
       this.props.setDestination(value);
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
         'date': 'MM / DD'  // date format
       };
       // optional property, too.
       let color = {
         mainColor: '#636877'
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
                   onRequestClose={() => {alert("Modal has been closed.")}}
                   >
                   <View style={{marginTop: 22}}>

                      <View>
                      <ModalDropdown
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        onSelect={this.onSelectCapacity}
                      />
                        <TouchableHighlight onPress={() => {
                          this.setCapacityModalVisible(!this.state.capacityModalVisible)
                        }}>
                          <Text>Hide Modal</Text>
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
                   onConfirm={this.confirmDate}
                   />
                   </View>

                   <Modal
                   animationType='slide'
                   transparent={false}
                   visible={this.state.whereModalVisible}
                   onRequestClose={() => {alert("Modal has been closed.")}}
                   >
                    <ModalDropdown
                      options={this.props.locations}
                      onSelect={this.onSelectLocation}
                    />
                    <TouchableHighlight onPress={() => {
                      this.setWhereModalVisible(!this.state.whereModalVisible)
                    }}>
                      <Text>Hide Modal</Text>
                    </TouchableHighlight>
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
    backgroundColor: '#818591',
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
    backgroundColor: '#818591',
    marginRight: 14,
    marginLeft: 14,
  },
});

export default SearchAnimations;
