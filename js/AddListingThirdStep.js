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

class AddListingThirdStep extends Component {

  constructor() {
    super();
    this.state = {
      numberOfToilets: 0,
      numberOfBaths: 0,
    }
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingForthStep');
  }

  render() {

    return(
      <View style={styles.container}>
        <View style={styles.inputWrapper}>

        <View style={styles.inputSection} >
        <Text>تعداد حمام</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.numberOfBaths}
          onValueChange={(itemValue, itemIndex) => this.setState({numberOfBaths: itemValue})}>
          <Picker.Item label="۱" value="1" />
          <Picker.Item label="۲" value="2" />
          <Picker.Item label="۳" value="3" />
          <Picker.Item label="+۳" value="+3" />
        </Picker>
        </View>

        <View>
        <Text>تعداد دسشویی</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.numberOfToilets}
          onValueChange={(itemValue, itemIndex) => this.setState({numberOfToilets: itemValue})}>
          <Picker.Item label="۱" value="1" />
          <Picker.Item label="۲" value="2" />
          <Picker.Item label="۳" value="3" />
          <Picker.Item label="+۳" value="+3" />
        </Picker>
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

export default AddListingThirdStep;
