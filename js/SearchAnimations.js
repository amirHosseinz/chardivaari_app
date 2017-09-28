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
import Calendar from 'react-native-calendar-select';

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
      modalVisible: false,
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
              height: 240,
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
              height: 80,
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
              size={40}
              color='#d5d7dd'
              style={styles.iconface}
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
             <TouchableOpacity>
                <Text style={styles.button}>
                مقصد
                </Text>
             </TouchableOpacity>
             </View>
           );
         } else {
           return(
             <View style={styles.itemStyle}>
             <TouchableOpacity>
                <Text style={styles.button} onPress={this.expandElement}>
                Sum
                </Text>
             </TouchableOpacity>
             </View>
           );
         }
     }

     showModal = () => {
       this.setState({
         modalVisible: true,
       });
     }

     renderRest () {
       if (this.state.isOpen) {
         return(
           <View style={styles.itemStyle}>
           <TouchableOpacity>
              <Text style={styles.button} onPress={this.openCalendar}>
              زمان
               </Text>
           </TouchableOpacity>
           </View>
         );
       }
     }

     renderThird () {
       if (this.state.isOpen) {
         return(
           <View style={styles.itemStyle}>
           <TouchableOpacity>
              <Text style={styles.button} onPress={this.showModal}>
              چند نفر؟
              </Text>
           </TouchableOpacity>
           </View>
         );
       }
     }

     setModalVisible (visible) {
       this.setState({
         modalVisible: visible,
       });
     }

     confirmDate({startDate, endDate, startMoment, endMoment}) {
       this.setState({
         startDate,
         endDate
       });
       console.log('startDate is: ');
       console.log(startDate);
       console.log('endDate is: ');
       console.log(endDate);
     }

     openCalendar() {
       this.calendar && this.calendar.clear();
       this.calendar && this.calendar.open();
     }

     render () {
       let customI18n = {
         'w': ['', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
         'weekday': ['', 'دوشنبه', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
         'text': {
           'start': 'تاریخ شروع',
           'end': 'تاریخ پایان',
           'date': 'تاریخ',
           'save': 'تایید',
           'clear': 'ریست کردن'
         },
         'date': 'DD / MM'  // date format
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
                   visible={this.state.modalVisible}
                   onRequestClose={() => {alert("Modal has been closed.")}}
                   >
                   <View style={{marginTop: 22}}>

                      <View>
                        <Text>Hello World!</Text>
                        <TouchableHighlight onPress={() => {
                          this.setModalVisible(!this.state.modalVisible)
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
                   format="YYYYMMDD"
                   minDate="20170510"
                   maxDate="20180312"
                   startDate={this.state.startDate}
                   endDate={this.state.endDate}
                   onConfirm={this.confirmDate}
                   />
                   </View>

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
    fontFamily: "IRANSans",
    fontSize: 16,
    marginTop: 10,
    marginRight: 5,
    paddingRight: 12,
    paddingTop:1,
    paddingBottom:1,
  },
  itemStyle: {
    width: Dimensions.get('screen').width - 20,
    height: 55,
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
});

export default SearchAnimations;
