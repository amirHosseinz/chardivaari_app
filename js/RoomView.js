import React, { Component } from 'react';
import { Dimensions, Alert, View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import Stars from 'react-native-stars-rating';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import { resultsToShow } from './data';


class RoomView extends Component{
  state={room: null, region: null, marker: null};
  mapStyle = [];

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
  }

  render() {
    return(
      <View style={styles.container}>
      <ScrollView>
        <Card>
          <CardSection>
            <Image
              style={ styles.imageStyle }
              source={{ uri: this.state.room.image_url }}
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
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.bedRooms } تخت</Text>
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.rooms } اتاق</Text>
              <Text style={{padding: 10, fontSize: 20}} >{ this.state.room.toilets } سرویس بهداشتی</Text>
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
            <Text style={{padding: 5, fontSize: 20}} >ساعت خروج: {this.state.room.checkOut}</Text>
            <Text style={{padding: 5, fontSize: 20}} >ساعت ورود: {this.state.room.checkIn}</Text>
            </View>
          </CardSection>
        </Card>
      </ScrollView>
      <View style={styles.footerStyle} >
        <CardSection>
          <Button onPress={() => { Alert.alert('reserve the room.')}} >
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
});

export default RoomView;
