import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import CacheStore from 'react-native-cache-store';

import { testURL, productionURL } from './data';

class EditListingScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      token: null,
      listing: null,
      dailyPrice: null,
      weeklyDiscount: null,
      monthlyDiscount: null,
      unAvailableDates: [],
    };
  }

  componentWillMount () {
    CacheStore.get('token').then((value) => this.setToken(value));
    this.setState({ listing: this.props.navigation.state.params.listing });
    this.setState({
      dailyPrice: this.props.navigation.state.params.listing.price,
      weeklyDiscount: this.props.navigation.state.params.listing.discount_per_week,
      monthlyDiscount: this.props.navigation.state.params.listing.discount_per_month,
    });
  }

  setToken(token) {
    this.setState({
      token
    });
  }

  onButtonPress () {
    // const {navigate} = this.props.navigation;
    // navigate('addListingFourteenthStep');
    fetch(productionURL + '/api/edit/listing/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        room_id: this.state.listing.id,
        price: this.state.dailyPrice,
        discount_per_week: this.state.weeklyDiscount,
        discount_per_month: this.state.monthlyDiscount,
      }),
    })
    .then((response) => this.onEditResponseRecieved(response))
    .catch((error) => {
      console.error(error);
    });
  }

  onEditResponseRecieved (response) {
    body = JSON.parse(response._bodyText);
    console.log('body');
    console.log(body);
    if (response.status === 200) {
      // const {navigate} = this.props.navigation;
      // navigate('searchResults', {rooms: body.room});
      this.setState({
        dailyPrice: body.room.price,
        weeklyDiscount: body.room.discount_per_week,
        monthlyDiscount: body.room.discount_per_month,
      });
      if ('discount_error' in body) {
        Alert.alert('اعداد درصد تخفیف باید کمتر از ۱۰۰ باشند.');
      } else {
        Alert.alert('اطلاعات با موفقیت ثبت شد.');
      }
    } else if (response.status === 401) {
      console.log('unAuthorized action.');
    } else {
      // TODO
      // error handling
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{this.state.listing.title}</Text>
        </View>

        <ScrollView style={styles.inputWrapper} >

        <View style={styles.editItemStyle}>
          <Text style={styles.text} >قیمت روزانه</Text>
          <View style={styles.priceInput}>
            <TextInput
              placeholder={'قیمت روزانه'}
              keyboardType = 'numeric'
              autoCorrect={false}
              style={styles.inputStyle}
              value={String(this.state.dailyPrice)}
              onChangeText={dailyPrice => this.setState({ dailyPrice })}
            />
            <Text>تومان</Text>
          </View>
        </View>

        <View style={styles.editItemStyle}>
          <Text style={styles.text} >تخفیف هفتگی</Text>
          <View style={styles.priceInput}>
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

        <View style={styles.editItemStyle}>
          <Text style={styles.text} >تخفیف ماهیانه</Text>
          <View style={styles.priceInput}>
            <TextInput
              placeholder={'تخفیف ماهیانه'}
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

        <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} >
          <Text style={styles.textStyle} >
            ثبت اطلاعات جدید
          </Text>
        </TouchableOpacity>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputWrapper: {
    marginTop: 20,
  },
  headerContainer: {
    width: Dimensions.get('screen').width,
    height: 50,
    padding: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f4f4f',
  },
  headerText: {
    color: 'white',
    fontSize: 23,
  },
  editItemStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: Dimensions.get('screen').width - 20,
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#5f9ea0',
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    width: Dimensions.get('screen').width / 2,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 150,
    height: 60,
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

export default EditListingScreen;
