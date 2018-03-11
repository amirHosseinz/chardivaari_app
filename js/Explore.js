import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Platform,
  PanResponder,
} from 'react-native';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from 'recyclerlistview';
import CacheStore from 'react-native-cache-store';
import {
  GoogleAnalyticsTracker,
} from 'react-native-google-analytics-bridge';

import ExploreResult from './ExploreResult';
import SearchAnimations from './SearchAnimations';
import { productionURL, GATrackerId } from './data';


class Explore extends Component {
  constructor (props) {
    super(props);
    let { width } = Dimensions.get('window');
    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    this._layoutProvider = new LayoutProvider(
      index => {
        return 0;
      },
      (type, dim, index) => {
        switch (type) {
          case 0:
            dim.width = width - 5;
            dim.height = 112;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this.state = {
      error: null,
      token: null,
      capacity: null,
      start_date: null,
      end_date: null,
      destination: null,
      rooms: this.dataProvider.cloneWithRows([]),
      locations: [],
      tracker: null,
    };
  }

  componentWillMount() {
    let GAtracker = new GoogleAnalyticsTracker(GATrackerId);
    GAtracker.trackScreenView('Explore');
    this.setState({
      tracker: GAtracker,
    });
    if (this.state.rooms.getSize() < 1) {
      CacheStore.get('token').then((value) => {
        this.setState({ token: value }, () => {
          this.fetchHomepage();
        });
      });
    }

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) >= 2;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dy) >= 2;
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (gestureState.dy < -2) {
          this.searchPicker.collapseFromOutside();
        }
      },
    });

  }

  fetchHomepage () {
    fetch(productionURL + '/api/v1/homepage/', {
      method: 'POST',
      body: JSON.stringify({
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
    })
    .then((response) => this.onFetchHomepageResponseRecieved(response))
    .catch((error) => {
      this.setState({
        error: 'خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.'
      });
    });
  }

  onFetchHomepageResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      lc = [];
      for (var i = 0; i < body.location.length; i++) {
        lc.push(body.location[i].text);
      }
      lc.push('هر کجا');
      lc.reverse();
      this.setState({
        error: null,
        rooms: this.dataProvider.cloneWithRows(body.room),
        locations: lc,
      });
    } else {
      this.setState({ error: 'خطایی رخ داده.' });
    }
  }

  onSearchButtonPress = () => {
    fetch(productionURL + '/api/v1/search/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.state.token,
      },
      body: JSON.stringify({
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        location: this.state.destination,
        start_date: (this.state.start_date == null) ? null : this.state.start_date.toISOString(),
        end_date: (this.state.end_date == null) ? null : this.state.end_date.toISOString(),
        capacity: this.state.capacity,
      }),
    })
    .then((response) => this.onSearchResponseRecieved(response))
    .catch((error) => {
      this.setState({
        error: 'خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.'
      });
    });
  }

  onSearchResponseRecieved (response) {
    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        error: null,
        rooms: this.dataProvider.cloneWithRows(body.room),
      });
    } else {
      this.setState({ error: 'خطایی رخ داده.' });
    }
  }

  setStartDate = (startDate) => {
    if (this.state.start_date != startDate) {
      this.setState({
        start_date: startDate,
      }, () => {
        if (this.state.tracker != null) {
          this.state.tracker.trackEvent('Search', 'date', {
            label: this.state.start_date + ' untill ' + this.state.end_date,
            value: 200
          });
        }
        this.onSearchButtonPress();
      });
    }
  }

  setEndDate = (endDate) => {
    if (this.state.end_date != endDate) {
      this.setState({
        end_date: endDate,
      }, () => {
        if (this.state.tracker != null) {
          this.state.tracker.trackEvent('Search', 'date', {
            label: this.state.start_date + ' untill ' + this.state.end_date,
            value: 200
          });
        }
        this.onSearchButtonPress();
      });
    }
  }

  setDestination = (destination) => {
    if (this.state.destination != destination) {
      this.setState({ destination }, () => {
        if (this.state.tracker != null) {
          this.state.tracker.trackEvent('Search', 'destination', {
            label: this.state.destination,
            value: 200
          });
        }
        this.onSearchButtonPress();
      });
    }
  }

  setCapacity = (capacity) => {
    if (this.state.capacity != capacity) {
      this.setState({ capacity }, () => {
        if (this.state.tracker != null) {
          this.state.tracker.trackEvent('Search', 'capacity', {
            label: this.state.start_date + ' untill ' + this.state.end_date,
            value: this.state.capacity
          });
        }
        this.onSearchButtonPress();
      });
    }
  }

  rowRenderer = (type, data) => {
    return (
      <ExploreResult room={data} navigation={this.props.navigation} />
    );
  }

  renderError () {
    if (this.state.error != null) {
      return(
        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
      );
    }
  }

  render () {
    return(
      <View style={styles.container}>

        <SearchAnimations
          ref={instance => { this.searchPicker = instance; }}
          locations={this.state.locations}
          setStartDate={this.setStartDate}
          setEndDate={this.setEndDate}
          setDestination={this.setDestination}
          setCapacity={this.setCapacity} />
        <View style={styles.filter}>
        </View>
        {this.renderError()}

        <View {...this._panResponder.panHandlers}>
          <RecyclerListView
            layoutProvider={this._layoutProvider}
            dataProvider={this.state.rooms}
            rowRenderer={this.rowRenderer}
            style={{
              width: Dimensions.get('window').width,
              marginRight: 5,
              marginLeft: 5,
              marginBottom: 75,
              ...Platform.select({
                android: {
                  paddingLeft: 5,
                },
                ios: {
                  paddingLeft: 7,
                },
              }),
            }} />
          </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  filter : {
    backgroundColor: '#0ca6c1',
    height:6,
    width: Dimensions.get('window').width,
    elevation:3,
  },
  errorTextStyle: {
    fontSize: 16,
    fontFamily: "IRANSansMobileFaNum",
    color: "red",
  },
});

export default Explore;
