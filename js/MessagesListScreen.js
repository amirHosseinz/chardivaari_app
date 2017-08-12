import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  ListView,
} from 'react-native';

import InboxRow from './InboxRow';
import InboxHeader from './InboxHeader';
import { messageListData, unreadMessagesCount } from './data';

class MessagesListScreen extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
    });

    this.state={
      dataSource: ds.cloneWithRowsAndSections(messageListData),
      unreadCount: 0,
    };
  }

  componentWillMount() {
    this.setState({ unreadCount: unreadMessagesCount });
  }

  onUnreadMessagePress() {
    // TODO
    // dis count unread count
    Alert.alert('you read message.');
  }

  render() {
    return(
      <View style={styles.container} >
        <InboxHeader count={this.state.unreadCount} />
        <ScrollView style={styles.contentWrapper}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(message) =>
            <InboxRow
              navigation={this.props.navigation}
              message={message}
            />
          }
        />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#F5FCFF',
  },
  contentWrapper: {
    marginBottom: 70,
  },
});

export default MessagesListScreen;
