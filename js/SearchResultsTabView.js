import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import SearchResults from './SearchResults';
import SearchResultsMapView from './SearchResultsMapView';

class SearchResultsTabView extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'List', },
      { key: '2', title: 'Map' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={({route}) => {
          switch (route.key) {
            case '1':
              return(<SearchResults navigation={this.props.navigation} />);
            case '2':
              return(<SearchResultsMapView navigation={this.props.navigation} />);
            default:
              return(<SearchResults navigation={this.props.navigation} />);
          }
        }}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        onRequestChangeTab={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchResultsTabView;
