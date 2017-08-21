import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, Alert } from 'react-native';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';

class RoomPreview extends Component {

  componentWillMount() {
    console.log('preview: ');
    console.log(localServer + this.props.room.preview);
  }

  render() {
    return(
      <Card>
        <CardSection>
          <View style={ styles.thumbnailContainerStyle }>
            <Image
              style={ styles.thumbnailStyle }
              source={{ uri: localServer + this.props.room.preview }}
            />
          </View>
          <View style={ styles.headerContentStyle } >
            <Text style={ styles.headerTextStyle }>{ this.props.room.district }</Text>
            <Text>{ this.props.room.address }</Text>
          </View>
        </CardSection>

        <CardSection>
          <Image
            style={ styles.imageStyle }
            source={{ uri: localServer + this.props.room.preview }}
          />
        </CardSection>

        <CardSection>
          <View style={styles.priceStyle}>
            <Text style={styles.priceTextStyle} >{this.props.room.price}تومان</Text>
          </View>
        </CardSection>

        <CardSection>
          <Button onPress={() => { this.props.navigation.navigate('roomView', {room: this.props.room}) }} >
            مشاهده‌ی خانه
          </Button>
        </CardSection>
        <CardSection>
          <Button onPress={() => { Alert.alert(localServer + this.props.room.preview)}}>
            رزرو کنید!
          </Button>
        </CardSection>
      </Card>
    );
  }
}

const localServer = 'http://192.168.12.100:8000';
const server = '';

const styles = StyleSheet.create({
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },
  priceStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  priceTextStyle: {
    fontSize: 30,
  },
});

export default RoomPreview;
