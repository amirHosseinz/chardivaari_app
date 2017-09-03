import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
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

import Card from './common/Card';
import CardSection from './common/CardSection';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';

import { testURL, productionURL } from './data';

class RequestBook extends Component {

  constructor (props) {
    super (props);
    this.state={
      roomId: '',
      numberOfGuests: '',
      from_date: new Date(),
      untill_date: new Date(),
      description: '',
      token: '',
      fromCalVisible: false,
      untillCalVisible: false,
      error: null,
    };
  }

  componentWillMount () {
    this.setState({ roomId: this.props.navigation.state.params.roomId });
    CacheStore.get('token').then((value) => {
      this.setState({ token: value });
    });
  }

  onFromCalButtonPress () {
    if (this.state.fromCalVisible) {
      this.setState({ fromCalVisible: false });
    } else {
      this.setState({ fromCalVisible: true });
    }
  }

  onUntillCalButtonPress () {
    if (this.state.untillCalVisible) {
      this.setState({ untillCalVisible: false });
    } else {
      this.setState({ untillCalVisible: true });
    }
  }

  onRequestBookButtonPress () {
    fetch(productionURL + '/api/room/request/book/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        room_id: this.state.roomId,
        start_date: this.state.from_date.toISOString(),
        end_date: this.state.untill_date.toISOString(),
        number_of_guests: this.state.numberOfGuests,
        description: this.state.description,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      console.error(error);
    });
  }

  onResponseRecieved (response) {
    body = JSON.parse(response._bodyText);
    console.log('body');
    console.log(body);
    if (response.status === 200) {
      this.setState({ error: null });
      if (!body.is_available) {
        this.setState({ error: 'خانه در این تاریخ رزرو شده است.' });
      } else {
        if (body.is_requested) {
          Alert.alert('درخواست با موفقیت ثبت شد.');
          // TODO
        } else {
          this.setState({ error: 'خطایی رخ داده.' });
        }
      }
      // const {navigate} = this.props.navigation;
      // navigate('searchResults', {rooms: body.room});
    } else {
      this.setState({ error: 'خطا در برقراری ارتباط با سرور!' });
    }
  }

  render () {
    return(
      <View style={styles.container}>
      <ScrollView>
      <Card>

      <View style={styles.itemContainer}>
      <CardSection>
        <Input
          placeholder="1"
          label="چند نفر؟"
          value={this.state.numberOfGuests}
          onChangeText={numberOfGuests => this.setState({ numberOfGuests })}
        />
      </CardSection>
      </View>

      <View style={styles.itemContainer} >
        <CardSection>
          <Button onPress={this.onFromCalButtonPress.bind(this)}>
            از؟
          </Button>
        </CardSection>
        <CardSection>
          {this.state.fromCalVisible ?
            <PersianCalendarPicker
            selectedDate={this.state.from_date}
            onDateChange={(date) => { this.setState({ from_date: date }) }}
            /> : null }
        </CardSection>
      </View>

      <View style={styles.itemContainer} >
        <CardSection>
          <Button onPress={this.onUntillCalButtonPress.bind(this)}>
            تا؟
          </Button>
        </CardSection>
        <CardSection>
          {this.state.untillCalVisible ?
            <PersianCalendarPicker
            selectedDate={this.state.untill_date}
            onDateChange={(date) => { this.setState({ untill_date: date }) }}
            /> : null }
        </CardSection>
      </View>

      <View style={styles.itemContainer} >
      <CardSection>
        <Input
          placeholder="توضیحات"
          label='توضیحات را در این جا قید فرمایید.'
          value={this.state.description}
          onChangeText={description => this.setState({ description })}
        />
      </CardSection>
      </View>

      <Text style={styles.errorTextStyle}>
        {this.state.error}
      </Text>

      <CardSection>
        <Button onPress={this.onRequestBookButtonPress.bind(this)}>
        رزرو کن!
        </Button>
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
  itemContainer: {
    flex: 1,
    marginTop: 10,
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
});

export default RequestBook;
