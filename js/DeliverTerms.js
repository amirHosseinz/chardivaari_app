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

class DeliverTerms extends Component {
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
          <Text style={styles.h1}>قوانین تحویل خانه </Text>
          <View style={{width:28}}></View>
        </View>
      </View>
      <ScrollView>
      <View style={styles.container2}>
      </View>
        <View style={{alignItems:'flex-end',width: Dimensions.get('window').width - 45}}>

        <Text style={styles.aboutustext}>
     الف) قبل از انجام اولین رزرو، کاربر مهمان موظف است شماره ملی خود را در اطلاعات حساب کاربری خود وارد کند.
        </Text>
        <Text style={styles.aboutustext}>
        ب) میزبان موظف است نام و شماره ملی ارائه شده از طرف تریپین را با کارت شناسایی وچهره مهمانان تطابق دهد. در صورت عدم تطابق اطلاعات ارائه شده توسط سایت و مهمان، میزبان موظف است در اولین فرصت به شرکت اطلاع دهد و اجازه دارد از ورود مهمان جلوگیری کند.
        </Text>
        <Text style={styles.aboutustext}>
        ج) در صورتی که مهمان اظهار نماید که ادعای میزبان مبنی بر عدم تطابق درست نمی‌باشد، مرکز حل اختلاف بر سر تایید مهمان تصمیم می‌گیرد.
     مرکز حل اختلاف مسئله را به عنوان ۱) تطابق ۲) عدم تطابق و یا ۳) سوء تفاهم شناسایی می‌کند.
        </Text>
        <Text style={styles.aboutustext}>
        د) اگر مسئله به عنوان عدم تطابق شناسایی شد، پول میزبان پرداخت خواهد شد و امکان رزرو اقامتگاه در زمان رزرو شده توسط سایت وجود ندارد.
        </Text>
        <Text style={styles.aboutustext}>
        هـ) اگر مسئله به عنوان تطابق شناسایی شد، میزبان موظف است مهمان را پذیرش کند.
        </Text>
        <Text style={styles.aboutustext}>
        و) اگر مسئله به عنوان « سوء تفاهم » شناسایی شود، به عنوان حل شده توسط مرکز اختلاف شناسایی می‌شود.
        </Text>
        <Text style={styles.aboutustext}>
        ز) در زمان تحویل کلید، مهمان موظف است یک کارت شناسایی از خود را در اختیار میزبان قرار دهد. این کارت تا پایان اقامت مهمان در اختیار میزبان خواهد ماند.
        </Text>
        <Text style={styles.aboutustext}>
        توجه : پس از پایان اقامت و در صورت عدم بروز هرگونه اختلاف میان میزبان و مهمان، میزبان موظف است کارت شناسایی مهمان را به وی بازگرداند.
        </Text>
        <Text style={styles.aboutustext}>
        توجه : در صورت بروز اختلاف تریپین مسئولیتی در قبال خسارات و ادعاهای طرفین نخواهد داشت.
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
    fontFamily:'IRANSansMobileFaNum',
    textAlign:'right',
    color:'#4f4f4f',
    marginTop:5,
    width: Dimensions.get('window').width - 90,
  },
  h2:{
    fontSize:16,
    fontFamily:'IRANSansMobileFaNum-Medium',
    textAlign:'right',
    color:'#3e3e3e',
    marginTop:15,
  },
  aboutustext1:{
    fontSize:13,
    fontFamily:'IRANSansMobileFaNum-Light',
    textAlign:'right',
    color:'#4f4f4f',
    marginTop:5,
    marginRight:15,
    width: Dimensions.get('window').width - 90,
  },
  aboutustext2:{
    fontSize:14,
    fontFamily:'IRANSansMobileFaNum-Medium',
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
    fontFamily:"IRANSansMobileFaNum-Medium",
    color:"#3e3e3e",
  },
});

export default DeliverTerms;
