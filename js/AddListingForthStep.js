import React, { Component } from 'react';
import {
  Alert,
  View,
  TextInput,
  StyleSheet,
  Picker,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Button from './common/Button';

class addListingForthStep extends Component {

  constructor() {
    super();
    this.state = {
      province: '',
      city: '',
      street: '',
      kooche: '',
      pelaak: null,
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingFifthStep');
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.inputWrapper}>

        <View style={styles.inputSection} >
        <Text>استان</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.province}
          onValueChange={(itemValue, itemIndex) => this.setState({province: itemValue})} >
          <Picker.Item label="تهران" value="1" />
          <Picker.Item label="فارس" value="2" />
          <Picker.Item label="هرمزگان" value="3" />
          <Picker.Item label="مازندران" value="4" />
          <Picker.Item label="خراسان" value="5" />
          <Picker.Item label="سایر استان‌ها" value="+10" />
        </Picker>
        </View>

        <View style={styles.inputSection} >
          <Text>شهر</Text>
          <TextInput
            placeholder={'لطفا شهر خود را وارد کنید'}
            autoCorrect={false}
            style={styles.inputStyle}
            value={this.state.city}
            onChangeText={city => this.setState({ city })}
          />
        </View>

        <View style={styles.inputSection} >
        <Text>خیابان</Text>
        <TextInput
          placeholder={'لطفا خیابان خود را وارد کنید'}
          autoCorrect={false}
          style={styles.inputStyle}
          value={this.state.kooche}
          onChangeText={kooche => this.setState({ kooche })}
        />
        </View>

        <View style={styles.inputSection} >
        <Text>پلاک</Text>
        <TextInput
          placeholder={'لطفا پلاک خود را وارد کنید'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={this.state.pelaak}
          onChangeText={pelaak => this.setState({ pelaak })}
        />
        </View>
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
  inputSection: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
});

export default addListingForthStep;
