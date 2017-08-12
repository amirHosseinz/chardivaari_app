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

import LoginScreen from './LoginScreen';
import Card from './common/Card';
import CardSection from './common/CardSection';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import DatePicker from './common/DatePicker';

import { resultsToShow } from './data';


class SearchRoom extends Component {
  state = { numberOfGuests: '', from_date: '', untill_date: '', where: '' };

  onButtonPress() {
    // todo
    // get list of rooms from server
    // this.props.navigation.navigate('searchResults');
    const {navigate} = this.props.navigation;
    // var room = resultsToShow[0];
    // navigate('roomView', {room: room});
    navigate('searchResults');
  }

  renderButton() {
    return (
      <Button onPress={this.onButtonPress.bind(this)}>
      بگرد
      </Button>
    );
  }

  render() {
    return (
      <View style={styles.container} >
      <ScrollView>
      <Card >

      <CardSection>
        <Input
          placeholder="1"
          label="چند نفر؟"
          value={this.state.numberOfGuests}
          onChangeText={numberOfGuests => this.setState({ numberOfGuests })}
        />
      </CardSection>

        <CardSection>
          <DatePicker pickerText='از؟' />
        </CardSection>

        <CardSection>
          <DatePicker pickerText='تا؟' />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <CardSection>
          <Input
            placeholder="تهران"
            label='کجا؟'
            value={this.state.where}
            onChangeText={where => this.setState({ where })}
          />
        </CardSection>

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
});

export default SearchRoom;
