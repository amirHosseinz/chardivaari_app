import React, { Component } from 'react';
import {
  Dimensions,
  Alert,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';
import Stars from 'react-native-stars-rating';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import CacheStore from 'react-native-cache-store';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import { testURL, productionURL } from './data';

class RoomView extends Component {

  constructor (props) {
    super(props);
    this.state={
      token: '',
      username: '',
      room: null,
      region: null,
      marker: null,
    };
    this.mapStyle = [];
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  componentWillMount() {
    this.setState({ room: this.props.navigation.state.params.room });

    var initRegion = {
      latitude: this.props.navigation.state.params.room.latitude,
      longitude: this.props.navigation.state.params.room.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    this.setState({ region: initRegion });

    var pointCoordinate = {
      latitude: this.props.navigation.state.params.room.latitude,
      longitude: this.props.navigation.state.params.room.longitude,
    };
    var circleElement = {
      latlng: pointCoordinate,
      radius: 350,
    };
    this.setState({ marker: circleElement });

    CacheStore.get('token').then((value) => this.setToken(value));
    CacheStore.get('username').then((value) => this.setUsername(value));
  }

  setToken (token) {
    this.setState({
      token
    });
  }

  setUsername (username) {
    this.setState({
      username
    });
  }

  onPressContactHost () {
    fetch(productionURL + '/api/message/compose/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        sender: this.state.username,
        recipient: this.state.room.owner,
        subject: this.state.room.title,
        body: ' درخواست صحبت درباره‌ی خانه‌ی ' + this.state.room.title,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      console.error(error);
    });
  }

  onResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.props.navigation.navigate(
        'conversationScreen',
        {
          partyName: this.state.room.owner,
          messageId: body.message_id,
          username: this.state.username,
        }
      );
    } else {
      Alert.alert('خطایی رخ داده.');
    }
  }

  onRequestBookButtonPress () {
    this.props.navigation.navigate(
      'requestBook',
      {
        roomId: this.state.room.id,
      }
    );
  }

  render () {
    return(
      <View style={styles.container}>
      <ScrollView>
        <Card>
          <CardSection>
            <Image
              style={ styles.imageStyle }
              source={{ uri: productionURL + this.state.room.preview }}
            />
          </CardSection>

          <CardSection >
            <View style={styles.roomTitleStyle} >
              <Text style={styles.roomTitleTextStyle} >{this.state.room.title}</Text>
            </View>
          </CardSection>

          <CardSection >
            <View style={ styles.headerContentStyle } >
              <Text style={styles.headerTextStyle} >{ this.state.room.district }</Text>
              <Text style={styles.headerTextStyle} > ،</Text>
              <Text style={styles.headerTextStyle} >{ this.state.room.address }</Text>
            </View>
          </CardSection>
          <CardSection>
            <View style={styles.descriptionContentStyle} >
              <Text style={styles.headerTextStyle} >درباره‌ی این خانه:</Text>
              <Text>{this.state.room.description}</Text>
            </View>
          </CardSection>

          <CardSection >
            <View style={styles.roomOptions} >
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.capacity } مهمان</Text>
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.beds_number } تخت</Text>
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.rooms_number } اتاق</Text>
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.toilets_number } سرویس بهداشتی</Text>
            </View>
          </CardSection>

          <CardSection>
          <View style={styles.mapContainer} >
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={this.mapStyle}
            style={styles.map}
            region={this.state.region}
            onRegionChange={this.onRegionChange.bind(this)}
          >
            <MapView.Circle
              center={this.state.marker.latlng}
              radius={this.state.marker.radius}
              strokeColor={'green'}
              strokeWidth={3}
            />
          </MapView>
          </View>
          </CardSection>

          <CardSection>
            <View style={styles.checkInOutStyle}>
            <Text style={{padding: 5, fontSize: 20}} >ساعت خروج: {this.state.room.check_out}</Text>
            <Text style={{padding: 5, fontSize: 20}} >ساعت ورود از: {this.state.room.check_in_from}</Text>
            <Text style={{padding: 5, fontSize: 20}} >ساعت ورود تا: {this.state.room.check_in_till}</Text>
            </View>
          </CardSection>

          <CardSection>
            <View style={styles.headerContentStyle}>
            <TouchableHighlight onPress={this.onPressContactHost.bind(this)}>
            <View style={styles.contactHostStyle}>
                <Text style={styles.contactHostTextStyle}>تماس با میزبان</Text>
            </View>
            </TouchableHighlight>
            </View>
          </CardSection>

        </Card>
      </ScrollView>

      <View style={styles.footerStyle} >
        <CardSection>
          <Button onPress={this.onRequestBookButtonPress.bind(this)} >
            رزرو کن
          </Button>
          <View style={styles.reviewStyle} >
          <Stars
            isActive={false}
            rateMax={5}
            isHalfStarEnabled={true}
            rate={this.state.room.rating}
            size={30}
          />
          <Text>{this.state.room.price}</Text>
          </View>
        </CardSection>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },
  headerContentStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  descriptionContentStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  headerTextStyle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  roomTitleStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomTitleTextStyle: {
    color: 'black',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 35,
    textShadowColor: '#a9a9a9',
    textShadowRadius: 10,
  },
  roomOptions: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  footerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: Dimensions.get('screen').width-20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  checkInOutStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactHostTextStyle: {
    color: 'black',
    fontSize: 20,
  },
  contactHostStyle: {
    padding: 15,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#ffa07a',
  },
});

export default RoomView;
