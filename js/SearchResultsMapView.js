import React, { Component } from 'react';
import { Dimensions, Alert, Text, View, ScrollView, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Card from './common/Card';
import CardSection from './common/CardSection';
import RoomPreview from './RoomPreview';
import { resultsToShow } from './data';

class SearchResultsMapView extends Component{
  state = {region: null, markers: [], markerPressed: false};
  mapStyle = [];

  onRegionChange(region) {
    this.setState({ region });
  }

  componentWillMount() {
    var initRegion = {
      latitude: 35.74,
      longitude: 51.404343,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    };
    this.setState({ region: initRegion });

    var markersList = [];
    var pointCoordinate = {
      latitude: 35.74,
      longitude: 51.404343,
    };
    var pointCoordinate2 = {
      latitude: 35.75,
      longitude: 51.43,
    };
    var markerElement1 = {
      id: 1,
      latlng: pointCoordinate,
      title: 'this is title',
      description: 'this is description',
    };
    var markerElement2 = {
      id: 2,
      latlng: pointCoordinate2,
      title: 'this is title 2',
      description: 'this is description 2',
    };
    markersList.push(markerElement1);
    markersList.push(markerElement2);
    this.setState({ markers: markersList });
  }

  onPressMarker(e) {
    Alert.alert(String(e.nativeEvent.coordinate.latitude));
    this.setState({ markerPressed: true });
  }

  renderSelectedMarker(){
    if (this.state.markerPressed) {
      return <RoomPreview room={resultsToShow[0]} navigation={this.props.navigation} />
    }
  }

  render() {
    return(
      <ScrollView >
      <Card>
      <CardSection>
      <View style={styles.container} >
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={this.mapStyle}
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
        >
        {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              onPress={this.onPressMarker.bind(this)}
            />
          ))}
        </MapView>
        </View>
        </CardSection>
        <CardSection>
        <View style={styles.selectedRoomStyle} >
        {this.renderSelectedMarker()}
        </View>
        </CardSection>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 400,
    width: Dimensions.get('screen').width - 25,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedRoomStyle: {
    flex: 1,
  },
});

export default SearchResultsMapView;
