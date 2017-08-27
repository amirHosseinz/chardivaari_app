import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TouchableHighlight,
  Footer,
  FooterTab,
  Dimensions,
} from 'react-native';
import CacheStore from 'react-native-cache-store';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';

import LoginScreen from './LoginScreen';
import Card from './common/Card';
import CardSection from './common/CardSection';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import DatePicker from './common/DatePicker';

import { testURL, productionURL } from './data';


class SearchRoom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfGuests: '',
      from_date: new Date(),
      untill_date: new Date(),
      where: '',
      token: '',
      fromCalVisible: false,
      untillCalVisible: false,
    };
  }

  componentWillMount() {
    CacheStore.get('token').then((value) => {
      // console.log(value);
      this.setState({ token: value });
    });
  }

  onSearchButtonPress() {
    fetch(productionURL + '/api/search/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        district: this.state.where,
        start_date: this.state.from_date.toISOString(),
        end_date: this.state.untill_date.toISOString(),
        capacity: this.state.numberOfGuests,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      console.error(error);
    });
  }

  onResponseRecieved(response) {
    console.log(response);
    body = JSON.parse(response._bodyText);
    console.log('body');
    console.log(body);
    if (response.status === 200) {
      const {navigate} = this.props.navigation;
      navigate('searchResults', {rooms: body.room});
      console.log('count is: ');
      console.log(body.total_count);
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  renderButton() {
    return (
      <Button onPress={this.onSearchButtonPress.bind(this)}>
      بگرد
      </Button>
    );
  }

  renderFromCalButton() {
    return(
      <Button onPress={this.onFromCalButtonPress.bind(this)}>
        از؟
      </Button>
    );
  }

  onFromCalButtonPress() {
    if (this.state.fromCalVisible) {
      this.setState({ fromCalVisible: false });
    } else {
      this.setState({ fromCalVisible: true });
    }
  }

  renderUntillCalButton() {
    return(
      <Button onPress={this.onUntillCalButtonPress.bind(this)}>
        تا؟
      </Button>
    );
  }

  onUntillCalButtonPress() {
    if (this.state.untillCalVisible) {
      this.setState({ untillCalVisible: false });
    } else {
      this.setState({ untillCalVisible: true });
    }
  }

  render() {
    return (
      <View style={styles.container} >
      <ScrollView>
      <Card>

      <View style={styles.calendarContainer} >
      <CardSection>
        <Input
          placeholder="1"
          label="چند نفر؟"
          value={this.state.numberOfGuests}
          onChangeText={numberOfGuests => this.setState({ numberOfGuests })}
        />
      </CardSection>
      </View>

      <View style={styles.calendarContainer} >
        <CardSection>
          {this.renderFromCalButton()}
        </CardSection>
        <CardSection>
          {this.state.fromCalVisible ?
            <PersianCalendarPicker
            selectedDate={this.state.from_date}
            onDateChange={(date) => { this.setState({ from_date: date }) }}
            /> : null }
        </CardSection>
      </View>

      <View style={styles.calendarContainer} >
        <CardSection>
          {this.renderUntillCalButton()}
        </CardSection>
        <CardSection>
          {this.state.untillCalVisible ?
            <PersianCalendarPicker
            selectedDate={this.state.untill_date}
            onDateChange={(date) => { this.setState({ untill_date: date }) }}
            /> : null }
        </CardSection>
      </View>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <View style={styles.calendarContainer} >
        <CardSection>
          <Input
            placeholder="تهران"
            label='کجا؟'
            value={this.state.where}
            onChangeText={where => this.setState({ where })}
          />
        </CardSection>
        </View>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d3ff',
    marginBottom: 60 + 10,
  },
  buttonsContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d6d7da',
    padding: 13,
  },
  buttonTextStyle: {
    fontSize: 20,
    color: '#a9a9a9'
  },
  ImagesStyle: {
    height: 50,
    width: 50
  },
  buttomNavigation: {
    position: 'absolute',
    bottom: 1,
    width: Dimensions.get('screen').width,
    height: 60,
  },
  calendarContainer: {
    flex: 1,
    marginTop: 10,
  },
});

export default SearchRoom;
