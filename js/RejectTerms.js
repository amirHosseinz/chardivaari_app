import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class RejectTerms extends Component {
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

      <View style={styles.header0}>
        <View style={styles.header00}>
          <TouchableOpacity onPress={() => {this.props.onCloseModal()}}>
              <Icon size={28} color="#3e3e3e" name="close" />
          </TouchableOpacity>
          <Text style={styles.h1}>قوانین لغو</Text>
          <View style={{width:28}}></View>
        </View>
      </View>
      <ScrollView>
      <View style={styles.container2}>
      </View>
        <View style={{alignItems:'flex-end',width: Dimensions.get('window').width - 45}}>
    <Text style={styles.aboutustext}>
    الف) در صورتی که مهمان در فاصله زمانی بیشتر از ۴۸ ساعت به زمان تحویل کلید رزرو را کنسل کند، تمامی مبلغ اجاره به مهمان بازگردانده می شود. در این صورت میزبان موظف است مبلغ دریافتی جهت اجاره شب اول را ظرف مدت ۲۴ ساعت برای شرکت واریز نماید.
    </Text>
    <Text style={styles.aboutustext}>
    ب) در صورتی که مهمان قبل از دریافت کلید و در زمانی کمتر از ۴۸ ساعت به آغاز زمان تحویل کلید رزرو را کنسل کند، کل مبلغ اجاره به غیر از هزینه شب اول به وی بازگردانده می شود.
    </Text>
    <Text style={styles.aboutustext}>
    ج) در صورتی که مهمان پس از زمان تحویل کلید رزرو را کنسل کند، هزینه‌ی اقامت در آن واحد برای کمترین مقدار بین ۴۸ ساعت آینده یا تا پایان مدت رزرو از مهمان کسر می‌گردد و مابقی وجه استرداد می‌گردد.
    </Text>
    <Text style={styles.aboutustext}>
    د) در صورتی که میزبان رزرو را کنسل کند، تمامی مبلغ اجاره به مهمان بازگردانده می‌شود. در این موقعیت میزبان موظف است مبلغ دریافتی جهت اجاره شب اول را ظرف مدت ۲۴ ساعت برای شرکت واریز نماید.
    </Text>
    <Text style={styles.aboutustext}>
    هـ) در صورتی که میزبان رزرو را کنسل کند، شرکت تلاش می‌کند اقامتگاهی با شرایط مشابه (امکانات و قیمت) با اقامتگاه انتخابی مهمان برای وی تهیه کند. هزینه اقامتگاه ارائه شده به عهده مهمان می‌باشد. با این وجود، شرکت هیچ تعهدی در قبال ارائه اقامتگاه جایگزین نخواهد داشت.
    </Text>
    <View style={{paddingBottom:85}}>
    </View>
        </View>


      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  container1:{
    marginTop:15,
    width: Dimensions.get('window').width - 20,
    flexDirection:'row-reverse',

  },
  container2:{
    marginTop:25,
    alignItems:'center',
    backgroundColor: 'white',

  },
  backbuttonview:{
    flexDirection:'row-reverse',
    alignItems:'center',
    marginBottom:10,
  },
  logostyle:{
    height:100,
    resizeMode:'contain',
  },
  aboutustext:{
    fontSize:14,
    fontFamily:'Vazir',
    textAlign:'right',
    color:'#4f4f4f',
    marginTop:5,
    width: Dimensions.get('window').width - 90,
  },
  h2:{
    fontSize:16,
    fontFamily:'Vazir-Medium',
    textAlign:'right',
    color:'#3e3e3e',
    marginTop:15,
  },
  aboutustext1:{
    fontSize:13,
    fontFamily:'Vazir-Light',
    textAlign:'right',
    color:'#4f4f4f',
    marginTop:5,
    marginRight:15,
    width: Dimensions.get('window').width - 90,
  },
  aboutustext2:{
    fontSize:14,
    fontFamily:'Vazir-Medium',
    textAlign:'right',
    color:'#4f4f4f',
    marginRight:0,
    width: Dimensions.get('window').width - 90,
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
  h1:{
    fontSize:18,
    fontFamily:"Vazir-Medium",
    color:"#3e3e3e",
  },
});

export default RejectTerms;
