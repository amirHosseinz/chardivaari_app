import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state={
    };
  }

  handleURL = () => {
    Linking.openURL('https://www.trypinn.com').catch(err => console.log('An error occurred', err));
  }

  render () {
    return(
      <View style={styles.container}>

        <View style={styles.container1}>
          <TouchableOpacity onPress={() => {
            this.props.onCloseModal();
          }}>
            <View style={styles.backbuttonview}>
            <Icon size={36} color="#3e3e3e" name="close" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <Image style={styles.logostyle} source={require('./img/aboutlogo.png')}/>
        <Text style={{fontSize:26,fontFamily:'Vazir-Medium',textAlign:'center',color:'#12b2ce'}}>تریپین</Text>
        <Text style={{fontSize:14,fontFamily:'Vazir-Medium',textAlign:'center',color:'#9e9e9e',marginTop:10,}}>ویرایش : 0 . 1 . 0  </Text>
        <Text style={styles.aboutustext}>
تریپین در سال 1396 کار خود را آغاز نموده است.
تیم تریپین گرد هم آمده‌اند تا با ایجاد امکان اجاره انواع فضاهای اقامتی،
تجربه سفر را برای کاربران ایرانی
شیرین‌تر از همیشه نمایند.
        </Text>
        <TouchableOpacity onPress={() => {
          this.handleURL();
        }}>
        <Text style={{fontSize:18,fontFamily:'Vazir-Medium',textAlign:'center',color:'#12b2ce',marginTop:10,}}>www.trypinn.com</Text>
        </TouchableOpacity>

      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: 'white',
  },
  container1:{
    marginTop:15,
    width: Dimensions.get('window').width - 20,
    flexDirection:'row-reverse',
  },
  container2:{
    marginTop:55,
    alignItems:'center',
  },
  backbuttonview:{
    flexDirection:'row-reverse',
    alignItems:'center',
  },
  logostyle:{
    height:100,
    resizeMode:'contain',
  },
  aboutustext:{
    fontSize:16,
    fontFamily:'Vazir-Light',
    textAlign:'center',
    color:'#4f4f4f',
    marginTop:25,
    width: Dimensions.get('window').width - 90,
  }
});

export default AboutUs;
