import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

class AddListingFourteenthStep extends Component {

  constructor() {
    super();
    this.state={
      weeklyDiscount: '',
      monthlyDiscount: '',
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingFifteenthStep');
  }

  render() {
    return(
      <View style={styles.container} >
      <ScrollView style={styles.inputWrapper} >

        <View style={styles.inputSection} >
          <Text style={styles.text} >تخفیف هفتگی</Text>
          <View style={styles.priceInput} >
            <TextInput
              placeholder={'تخفیف هفتگی'}
              keyboardType = 'numeric'
              autoCorrect={false}
              style={styles.inputStyle}
              value={String(this.state.weeklyDiscount)}
              onChangeText={weeklyDiscount => this.setState({ weeklyDiscount })}
            />
            <Text>درصد</Text>
          </View>
        </View>

        <View style={styles.inputSection} >
          <Text style={styles.text} >تخفیف ماهانه</Text>
          <View style={styles.priceInput} >
            <TextInput
              placeholder={'تخفیف ماهانه'}
              keyboardType = 'numeric'
              autoCorrect={false}
              style={styles.inputStyle}
              value={String(this.state.monthlyDiscount)}
              onChangeText={monthlyDiscount => this.setState({ monthlyDiscount })}
            />
            <Text>درصد</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.buttonWrapper} >
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} >
        <Text style={styles.textStyle} >
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
  inputWrapper: {
    marginTop: 50,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
  },
  inputSection: {
    flex: 1,
    alignItems: 'stretch',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: Dimensions.get('screen').width / 2,
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
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddListingFourteenthStep;
