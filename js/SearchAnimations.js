import React, { Component } from 'react';
import {
  View,
  LayoutAnimation,
  TouchableOpacity,
  Text,
  NativeModules,
  StyleSheet,
  Image,
  Dimensions,
 } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  state = {
        isOpen: false,
        myStyle: {
          height: 80,
           flexDirection: 'column',
           alignItems: 'flex-start',
           justifyContent: 'space-around',
           backgroundColor: '#636877',
           paddingTop: 5,

        }
     };

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

     renderRest () {
       if (this.state.isOpen) {
         return(
           <View style={styles.itemStyle}>
           <TouchableOpacity>
              <Text style={styles.button}>
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
              <Text style={styles.button}>
              چند نفر؟
              </Text>
           </TouchableOpacity>
           </View>
         );
       }
     }

     render () {
        return (
           <View style={styles.container}>
                 <View style={this.state.myStyle}>
                 {this.renderLesserIcon()}
                 {this.renderFirst()}
                 {this.renderRest()}
                 {this.renderThird()}
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
