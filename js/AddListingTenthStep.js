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

class AddListingTenthStep extends Component {

  constructor() {
    super();
    this.state = {
      description: '',
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingEleventhStep');
  }

  render() {
    return(
      <View style={styles.container} >
        <View style={styles.inputWrapper} >
        <View style={styles.inputSection} >
          <Text style={styles.text} >توضیحات</Text>
          <TextInput
            placeholder={'اگر توضیحاتی در مورد خانه دارید اینجا بنویسید'}
            autoCorrect={false}
            style={styles.inputStyle}
            value={this.state.city}
            onChangeText={description => this.setState({ description })}
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
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
    borderColor: 'black',
    backgroundColor: '#d3d3d3',
    flexDirection: 'column',
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
  text: {
    fontSize: 25,
    color: 'black',
    paddingRight: 5,
  },
});

export default AddListingTenthStep;
