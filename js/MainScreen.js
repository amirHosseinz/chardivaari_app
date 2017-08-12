
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableHighlight,
} from 'react-native';


class MainScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer} >
          <TouchableHighlight onPress={ () => {this.props.navigation.navigate('guestScreen');}}>
          <View style={styles.button} >
            <Image
              style={styles.ImagesStyle}
              source={require('./img/guest.png')}
            />
            <Text style={styles.buttonTextStyle} >مهمان</Text>
          </View>
          </TouchableHighlight>
          </View>
          <View style={styles.buttonsContainer} >
          <TouchableHighlight onPress={() => { this.props.navigation.navigate('hostScreen') }}>
              <View style={styles.button} >
                <Image
                  style={styles.ImagesStyle}
                  source={require('./img/host.png')}
                />
                <Text style={styles.buttonTextStyle} >میزبان</Text>
              </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  componentDidMount() {
    // fetch(AIRBNB_API)
    //   .then(response => response.json())
    //   .then((data) => {
    //     console.log('Response from API:', data);
    //   });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#40E0D0',
  },
  buttonsContainer: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button:{
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d6d7da',
    padding: 13,
  },
  buttonTextStyle: {
    fontSize: 20,
    color: '#a9a9a9'
  },
  ImagesStyle: {
    height: 50,
    width: 50
  },
});

export default MainScreen;
