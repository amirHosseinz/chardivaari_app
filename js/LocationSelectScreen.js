import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


class LocationSelectScreen extends Component {

  onLocationSelect (location) {
    this.props.onSelect(location);
  }

  renderLocationsList () {
    return this.props.locations.map(location =>
      <View key={this.props.locations.indexOf(location)}>
        <TouchableOpacity style={styles.citybox} onPress={() => {
          this.onLocationSelect(location);
        }}>
          <Text style={styles.citynamestyle}>{location}</Text>
        </TouchableOpacity>
        <View style={styles.divider}></View>
      </View>
    );
  }

  render () {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            this.props.onCancel();
          }}>
            <View style={styles.backbuttonview}>
              <Icon size={40} color="#f3f3f3" name="close" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headtextstyle}>انتخاب مقصد</Text>
        </View>
        <ScrollView>
          <View style={styles.citynamesbox}>
            {this.renderLocationsList()}
            <View style={{marginTop:55}}></View>
          </View>
        </ScrollView>
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
   justifyContent:'flex-start',
  },
  header: {
    flexDirection:'row-reverse',
    justifyContent:"flex-start",
    width: Dimensions.get('window').width-50,
    paddingTop:25,
    paddingBottom:25,
  },
  headtextstyle:{
    fontSize:22,
    fontFamily:'Vazir-Medium',
    color:'white',
    marginRight:8,
  },
  citynamesbox:{
    width: Dimensions.get('window').width,
    paddingTop:0,
  },
  citynamestyle:{
    fontSize:18,
    fontFamily:'Vazir',
    color:"#ffffff",
    textAlign:'right',
    marginRight:20,
  },
  divider:{
    backgroundColor:'rgba(255,255,255,0.4)',
    height:1,
    marginTop:10,
    marginBottom:10,
  },
  citybox: {
    height:40,
  },
});

export default LocationSelectScreen;
