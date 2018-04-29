import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


class NumberSelectScreen extends Component {
  constructor (props) {
    super(props);
    this.state={
      numberOfGuests: 1,
    };
  }

  componentWillMount () {
    if (this.props.capacity != null) {
      this.setState({
        numberOfGuests: Number(this.props.capacity),
      });
    }
  }

  increaseGuest () {
    if (this.state.numberOfGuests < 50) {
      this.setState({
        numberOfGuests: this.state.numberOfGuests + 1,
      }, () => {
        this.props.onSelect(this.state.numberOfGuests);
      });
    }
  }

  decreaseGuest () {
    if (this.state.numberOfGuests > 1) {
      this.setState({
        numberOfGuests: this.state.numberOfGuests - 1,
      },() => {
        this.props.onSelect(this.state.numberOfGuests);
      });
    }
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={()=>{
          this.props.onCancel();
        }}>
          <View style={styles.backbuttonview}>
            <Icon size={40} color="#f3f3f3" name="close" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headtextstyle}>تعداد مسافران</Text>
        </View>
        <View>
          <View style={styles.interbox}>
            <View style={{paddingLeft:20}}>
              <TouchableHighlight
                underlayColor={'#0094ae'}
                activeOpacity={0.5}
                onPress={() => {
                  this.increaseGuest();
                }}
                style={styles.buttontouch0}>
              <Text style={{
                fontSize:36,
                color:'white',
                fontFamily:'IRANSansMobileFaNum',
                ...Platform.select({
                  ios: {
                    marginTop: 8,
                  },
                }),
              }}>+</Text>
              </TouchableHighlight>
            </View>
            <View style={{width:100,alignItems:'center',}}>
              <Text style={styles.numbertext}>{this.state.numberOfGuests}</Text>
            </View>
            <View style={{paddingRight:20}}>
              <TouchableHighlight
                underlayColor={'#0094ae'}
                activeOpacity={0.5}
                onPress={() => {
                  this.decreaseGuest();
                }}
                style={styles.buttontouch0}>
              <Text style={{
                fontSize:36,
                color:'white',
                fontFamily:'IRANSansMobileFaNum',
                alignSelf: "center",
                ...Platform.select({
                  ios: {
                    marginTop: 8,
                  },
                })
              }}>-</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{paddingBottom:40}}>
          <TouchableHighlight
          underlayColor={'#0094ae'}
          activeOpacity={0.5}
          onPress={() => {
            this.props.onConfirm();
          }}
          style={styles.buttontouch1}>
            <View style={styles.buttonview1}>
              <Text style={styles.reservebuttontext}>تایید</Text>
            </View>
          </TouchableHighlight>
        </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0ca6c0',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems:'center',
    justifyContent:'space-between'
  },
  header: {
    flexDirection:'row-reverse',
    justifyContent:"flex-start",
    width: Dimensions.get('window').width-50,
    paddingTop:25,
  },
  headtextstyle:{
    fontSize:22,
    fontFamily:'IRANSansMobileFaNum-Medium',
    color:'white',
    marginRight:8,
    ...Platform.select({
      ios: {
        marginTop: 8,
      },
    }),
  },
  buttontouch1: {
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 2,
    height:48,
    width: 148,
    flexDirection: "row-reverse",
    justifyContent:"center",
    alignItems:"center",
  },
  reservebuttontext: {
    fontSize: 20,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color: "#ffffff",
    paddingTop:4,
    paddingBottom:4,
    paddingRight:12,
    paddingLeft:12,
    marginBottom:5,
  },
  numbertext:{
    fontSize:68,
    fontFamily:"IRANSansMobileFaNum-Medium",
    color:'white',
    paddingBottom:10,
  },
  interbox:{
    flexDirection:'row-reverse',
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:150,
  },
  buttontouch0: {
    borderColor:"#ffffff",
    borderRadius: 50,
    borderWidth : 3,
    height:60,
    width: 60,
    justifyContent:"center",
    alignItems:"center",
  },
});

export default NumberSelectScreen;
