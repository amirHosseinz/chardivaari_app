import React, { Component } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class AddListingFifteenthStep extends Component {

  constructor() {
    super();
    this.state={};
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    Alert.alert('adding listing done');
    navigate('hostScreen');
  }

  render() {
    return(
      <View style={styles.container} >
      <ScrollView style={styles.inputWrapper} >
        <View style={styles.inputSection} >
          <Text style={styles.text} >ثبت خانه‌ی شما با موفقیت انجام شد.</Text>
          <Icon size={30} color={'green'} name={'check'} />
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper} >
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} >
        <Text style={styles.textStyle} >
          انتشار اقامت‌گاه
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
  inputWrapper: {
    marginTop: 50,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
  },
  inputSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: Dimensions.get('screen').width - 20,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 100,
    height: CONTINUE_BUTTON_HEIGHT,
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
  textStyle: {
    padding: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddListingFifteenthStep;
