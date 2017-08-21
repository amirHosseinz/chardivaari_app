import React, { Component } from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNExitApp from 'react-native-exit-app';

class ProfileRows extends Component {

  onPressAction(){
    if (this.props.data.action === 'hostScreen' || this.props.data.action === 'guestScreen' ||
        this.props.data.action === 'addListing' ){
      this.props.navigation.navigate(this.props.data.action, {token: ''});
    } else if (this.props.data.action === 'logout') {
      // TODO
      // delete token in app and cache
      // handle in iOS
      BackHandler.exitApp();
    } else {
      Alert.alert(this.props.data.action);
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.onPressAction.bind(this)} >
        <Text style={styles.text}>
          {this.props.data.text}
        </Text>
        <Icon size={this.props.data.icon.size} color={this.props.data.icon.color} name={this.props.data.icon.name} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#d3d3d3',
  },
  text: {
    marginRight: 12,
    fontSize: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default ProfileRows;
