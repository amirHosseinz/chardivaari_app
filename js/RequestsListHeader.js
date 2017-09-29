import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class RequestsListHeader extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.text} >شما {this.props.count} درخواست نیاز به بررسی دارید</Text>
        <TouchableOpacity onPress={this.props.onRefresh}>
          <Icon size={30} name={'autorenew'} color={'#ffa500'} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#808080',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.7,
    width: Dimensions.get('screen').width,
    height: 60,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default RequestsListHeader;
