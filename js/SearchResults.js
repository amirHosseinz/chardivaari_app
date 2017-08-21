import React, { Component } from 'react';
import { ScrollView } from 'react-native';

import RoomPreview from './RoomPreview';
import { resultsToShow } from './data';

class SearchResults extends Component {
  state={ rooms: [] };

  componentWillMount() {
    // TODO
    // read from server's response
    this.setState({ rooms: this.props.navigation.state.params.rooms });
    // this.setState({rooms: resultsToShow});
  }

  renderRooms() {
    return this.state.rooms.map(room =>
      <RoomPreview key={room.id} room={room} navigation={this.props.navigation} />
    );
  }

  render() {
    return (
      <ScrollView >
        {this.renderRooms()}
      </ScrollView>
    );
  }

}

export default SearchResults;
