import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import Card from './common/Card';
import CardSection from './common/CardSection';

class ProfileHeader extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.textStyle}>{this.props.user.firstName} {this.props.user.lastName}</Text>
          <Image
            style={ styles.imageStyle }
            source={{ uri: this.props.user.profilePictureUri }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#C1C1C1',
  },
  imageStyle: {
    width: 60,
    height: 60,
  },
  textStyle: {
    fontSize: 40
  },
});

export default ProfileHeader;
