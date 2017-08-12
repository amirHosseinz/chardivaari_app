import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';

import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';


class DatePicker extends Component {
  state = {
    date: new Date(),
    visible: false,
  };

  onButtonPress() {
    if (this.state.visible) {
      this.setState({ visible: false });
    }else{
      this.setState({ visible: true });
    }
  }

  renderButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        {this.props.pickerText}
      </Button>
    );
  }

  render() {
    return(
      <View style={styles.container} >
      <CardSection>
        {this.renderButton()}
      </CardSection>
      <CardSection>
        {this.state.visible ?
          <PersianCalendarPicker
          selectedDate={this.state.date}
          onDateChange={(date) => { this.setState({ date: date }) }}
          /> : null }
        <Text style={styles.selectedDate}> { this.state.date.toDateString() } </Text>
      </CardSection>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#000',
  }
});

export default DatePicker;
