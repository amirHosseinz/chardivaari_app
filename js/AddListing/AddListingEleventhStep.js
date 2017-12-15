import React, { Component } from 'react';
import {
  Alert,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Picker,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Switch } from 'react-native-switch';

import Button from './common/Button';

class AddListingEleventhStep extends Component {

  constructor() {
    super();
    this.state = {
      daysBeforeReserve: 0,
      reserveTill: 0,
      arriveAfter: '',
      arriveAfterPmAm: '',
      arriveBefore: '',
      arriveBeforePmAm: '',
      checkOut: '',
      checkOutPmAm: '',
      minimumStay: 0,
      maximumStay: 0,
      minimumStayAtHolidays: 0,
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingTwelvethStep');
  }

  render() {
    return(
      <View style={styles.container}>
        <ScrollView style={styles.inputWrapper}>

        <View style={styles.inputSection} >
        <Text style={styles.text} >رزرو از چند روز قبل</Text>
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.daysBeforeReserve}
          onValueChange={(itemValue, itemIndex) => this.setState({daysBeforeReserve: itemValue})}>
          <Picker.Item label="همان روز" value={0} />
          <Picker.Item label="۱" value={1} />
          <Picker.Item label="۲" value={2} />
          <Picker.Item label="۳" value={3} />
          <Picker.Item label="۴" value={4} />
          <Picker.Item label="۵" value={5} />
          <Picker.Item label="۶" value={6} />
          <Picker.Item label="۷" value={7} />
        </Picker>
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >رزرو تا کی</Text>
        <TextInput
          placeholder={'روز'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={String(this.state.reserveTill)}
          onChangeText={reserveTill => this.setState({ reserveTill })}
        />
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >ورود بعد از</Text>
        <TextInput
          placeholder={'ساعت'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={this.state.arriveAfter}
          onChangeText={arriveAfter => this.setState({ arriveAfter })}
        />
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.arriveAfterPmAm}
          onValueChange={(itemValue, itemIndex) => this.setState({arriveAfterPmAm: itemValue})}>
          <Picker.Item label="صبح" value=" AM " />
          <Picker.Item label="عصر" value=" PM " />
        </Picker>
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >ورود قبل از</Text>
        <TextInput
          placeholder={'ساعت'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={this.state.arriveBefore}
          onChangeText={arriveBefore => this.setState({ arriveBefore })}
        />
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.arriveBeforePmAm}
          onValueChange={(itemValue, itemIndex) => this.setState({arriveBeforePmAm: itemValue})}>
          <Picker.Item label="صبح" value=" AM " />
          <Picker.Item label="عصر" value=" PM " />
        </Picker>
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >خروج قبل از</Text>
        <TextInput
          placeholder={'ساعت'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={this.state.checkOut}
          onChangeText={checkOut => this.setState({ checkOut })}
        />
        <Picker
          style={styles.inputStyle}
          selectedValue={this.state.checkOutPmAm}
          onValueChange={(itemValue, itemIndex) => this.setState({checkOutPmAm: itemValue})}>
          <Picker.Item label="صبح" value=" AM " />
          <Picker.Item label="عصر" value=" PM " />
        </Picker>
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >کمترین تعداد شب اجاره</Text>
        <TextInput
          placeholder={'شب'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={String(this.state.minimumStay)}
          onChangeText={minimumStay => this.setState({ minimumStay })}
        />
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >بیشترین تعداد شب اجاره</Text>
        <TextInput
          placeholder={'شب'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={String(this.state.maximumStay)}
          onChangeText={maximumStay => this.setState({ maximumStay })}
        />
        </View>

        <View style={styles.inputSection} >
        <Text style={styles.text} >کمترین تعداد شب اجاره در تعطیلات</Text>
        <TextInput
          placeholder={'شب'}
          keyboardType = 'numeric'
          autoCorrect={false}
          style={styles.inputStyle}
          value={String(this.state.minimumStayAtHolidays)}
          onChangeText={minimumStayAtHolidays => this.setState({ minimumStayAtHolidays })}
        />
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
  inputStyle: {
    width: Dimensions.get('screen').width/5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputWrapper: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
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
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default AddListingEleventhStep;
