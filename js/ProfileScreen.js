import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
} from 'react-native';

import ProfileRows from './ProfileRows';
import ProfileHeader from './ProfileHeader';
import { guestProfileRowsData, hostProfileRowsData, users } from './data';


class ProfileScreen extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
    });
    if(this.props.role === 'host'){
      this.state = {
        dataSource: ds.cloneWithRowsAndSections(hostProfileRowsData),
      };
    } else {
      this.state = {
        dataSource: ds.cloneWithRowsAndSections(guestProfileRowsData),
      };
    }
  }

  render() {
    return(
      <ScrollView >
        <ListView style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={(data) => <ProfileRows navigation={this.props.navigation} data={data} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderHeader={() => <ProfileHeader user={users[0]} />}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#F5FCFF',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'black',
  },
});

export default ProfileScreen;
