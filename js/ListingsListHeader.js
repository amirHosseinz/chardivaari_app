import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

class ListingsListHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={styles.container} >
        <Text style={styles.headerText} >لیست خانه‌های ثبت شده در سیستم</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: 50,
    padding: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f4f4f',
  },
  headerText: {
    color: 'white',
    fontSize: 23,
  },
});

export default ListingsListHeader;
