import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Picker,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Button from './common/Button';

class AddListing extends Component {

  constructor() {
    super();
    this.state = {
      roomType: '',
    }
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingSecondStep');
  }

  render() {

    return(
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
        <Text>لطفا نوع خانه‌ی خود را انتخاب کنید:</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.roomType}
          onValueChange={(itemValue, itemIndex) => this.setState({roomType: itemValue})}>
          <Picker.Item label="خانه‌ی اختصاصی" value="privateRoom" />
          <Picker.Item label="خانه‌ی اشتراکی" value="sharedRoom" />
          <Picker.Item label="آپارتمان" value="apt" />
          <Picker.Item label="ویلا" value="villa" />
          <Picker.Item label="سوئیت" value="suite" />
          <Picker.Item label="هتل آپارتمان" value="hotelApt" />
        </Picker>
        </View>

        <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle}>
          <Text style={styles.textStyle}>
            ادامه
          </Text>
        </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const CONTINUE_BUTTON_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: Dimensions.get('screen').width - 20,
  },
  inputWrapper: {
    marginTop: 50,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: '#d3d3d3',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 100,
    height: CONTINUE_BUTTON_HEIGHT,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default AddListing;
