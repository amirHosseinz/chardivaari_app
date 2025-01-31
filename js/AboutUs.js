import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';


class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state={
      appVersion: null,
    };
  }

  componentWillMount () {
    var version = DeviceInfo.getVersion().split('.');
    this.setState({
      appVersion: version,
    });
  }

  handleURL = () => {
    Linking.openURL('http://www.tripinn.ir').catch(err => console.log('An error occurred', err));
  }

  renderVersion () {
    if (this.state.appVersion) {
      return(
        <Text style={{fontSize:14,fontFamily:'IRANSansMobileFaNum-Medium',textAlign:'center',color:'#9e9e9e',marginTop:10,}}>
          ویرایش : {this.state.appVersion[2]} . {this.state.appVersion[1]} . {this.state.appVersion[0]}
        </Text>
      );
    } else {
      return null;
    }
  }

  render () {
    return(
      <View style={styles.container}>

      <View style={styles.header0}>
        <View style={styles.header00}>
          <TouchableOpacity onPress={() => {this.props.onCloseModal()}}>
            <Icon size={28} color="#3e3e3e" name="arrow-forward" />
          </TouchableOpacity>
          <Text style={styles.h1}>درباره تریپین</Text>
          <View style={{width:28}}></View>
        </View>
      </View>
      <View style={styles.container2}>
        <Image style={styles.logostyle} source={require('./img/aboutlogo.png')}/>
        <Text style={{fontSize:26,fontFamily:'IRANSansMobileFaNum-Medium',textAlign:'center',color:'#12b2ce'}}>تریپین</Text>
        {this.renderVersion()}
        <Text style={styles.aboutustext}>
تریپین در سال 1396 کار خود را آغاز نموده است.
تیم تریپین گرد هم آمده‌اند تا با ایجاد امکان اجاره انواع فضاهای اقامتی،
تجربه سفر را برای کاربران ایرانی
شیرین‌تر از همیشه نمایند.
        </Text>
        <TouchableOpacity onPress={() => {
          this.handleURL();
        }}>
        <Text style={{fontSize:18,fontFamily:'IRANSansMobileFaNum-Medium',textAlign:'center',color:'#12b2ce',marginTop:10,}}>www.tripinn.ir</Text>
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
    fontFamily:'IRANSansMobileFaNum-Light',
    textAlign:'center',
    color:'#4f4f4f',
    marginTop:25,
    width: Dimensions.get('window').width - 90,
  },
  header0:{
    backgroundColor:'#ffffff',
    width: Dimensions.get('window').width,
    height: 56,
    alignItems:'center',
    justifyContent:'center',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      android: {
      },
    }),
  },
  header00:{
    width: Dimensions.get('window').width-36,
    height: 56,
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'space-between',
    elevation:3,
    ...Platform.select({
      ios: {
        height: 66,
        marginTop:14,
      },
      android: {
      },
    }),
  },
  h1:{
    fontSize:18,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color:"#3e3e3e",
  },
});

export default AboutUs;
