import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
 } from 'react-native';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import moment from 'moment-jalali';

class AddListingTwelvethStep extends Component {

  constructor() {
    super();
    this.state={
      selectedStartDate: new Date(),
      selectedEndDate: null,
      dateChanged: false,
      rangeComplete: false,
      intervals: [],
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    // if (!this.state.dateChanged) {
    //   this.setState({
    //     selectedStartDate: date,
    //     dateChanged: true,
    //   });
    // } else {
    //   if (!this.state.rangeComplete) {
    //     this.setState({
    //       selectedEndDate: date,
    //       rangeComplete: true,
    //     });
    //   } else {
    //     this.setState({
    //       selectedStartDate: date,
    //       rangeComplete: false,
    //     });
    //   }
    // }
    // another code!
    // Alert.alert(date);
    // dates = this.state.selectedStartDate;
    // jalaliDate = moment
    // dates.push(date);
    this.setState({ selectedStartDate: date });
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingThirteenthStep');
  }

  onDeleteIntervalPress() {
    Alert.alert('delete interval');
  }

  renderIntervals() {
    return this.state.intervals.map(interval =>
      <View style={styles.intervalStyle} >
        <Text style={styles.text} >از تاریخ</Text>
        <Text style={styles.text} >{interval.startDate.toString()}</Text>
        <Text style={styles.text} >، تا تاریخ</Text>
        <Text style={styles.text} >{interval.endDate.toString()}</Text>
        <TouchableOpacity onPress={this.onDeleteIntervalPress.bind(this)} >
          <Icon size={30} name={close} color={'red'} />
        </TouchableOpacity>
      </View>
    );
  }

  componentWillMound() {
    dates = this.state.selectedStartDate;
    dates.push(new Date());
    this.setState({ selectedStartDate: dates });
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2020, 6, 3);
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    return(
      <View style={styles.container} >
      <ScrollView style={styles.inputWrapper} >

      <View style={styles.inputSection} >
        <Text style={styles.text} >روزهای خارج از سرویس را مشخص نمایید</Text>
        <PersianCalendarPicker
          selectedDate={this.state.selectedStartDate}
          allowRangeSelection={true}
          startDate={this.state.selectedStartDate}
          endDate={this.state.selectedEndDate}
          todayBackgroundColor="#d3d3d3"
          selectedDayColor="red"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this.onDateChange}
        />
      </View>

      {this.renderIntervals()}

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
    backgroundColor: '#FFFFFF',
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

export default AddListingTwelvethStep;
