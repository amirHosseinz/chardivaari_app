import React, { Component } from 'react';
import { Alert, ScrollView, View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-switch';

class AddListingSixthStep extends Component {
  constructor() {
    super();
    this.state = {
      gym: false,
      parking: false,
      laundary: false,
      pool: false,
      hotTub: false,
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingSeventhStep');
  }

  render() {
    return(
      <View style={styles.container}>
      <ScrollView style={styles.optionContainer} >
        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>سالن ورزش</Text>
          <Switch
            value={false}
            onValueChange={(gym) => this.setState({ gym })}
            disabled={false}
            activeText={'بله'}
            inActiveText={'خیر'}
            backgroundActive={'green'}
            backgroundInactive={'#a9a9a9'}
            circleActiveColor={'#d3d3d3'}
            circleInActiveColor={'#d3d3d3'}
          />
        </View>

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>پارکینگ اختصاصی</Text>
          <Switch
            value={false}
            onValueChange={(parking) => this.setState({ parking })}
            disabled={false}
            activeText={'بله'}
            inActiveText={'خیر'}
            backgroundActive={'green'}
            backgroundInactive={'#a9a9a9'}
            circleActiveColor={'#d3d3d3'}
            circleInActiveColor={'#d3d3d3'}
          />
        </View>

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>خشک‌شویی</Text>
          <Switch
            value={false}
            onValueChange={(laundary) => this.setState({ laundary })}
            disabled={false}
            activeText={'بله'}
            inActiveText={'خیر'}
            backgroundActive={'green'}
            backgroundInactive={'#a9a9a9'}
            circleActiveColor={'#d3d3d3'}
            circleInActiveColor={'#d3d3d3'}
          />
        </View>

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>استخر</Text>
          <Switch
            value={false}
            onValueChange={(pool) => this.setState({ pool })}
            disabled={false}
            activeText={'بله'}
            inActiveText={'خیر'}
            backgroundActive={'green'}
            backgroundInactive={'#a9a9a9'}
            circleActiveColor={'#d3d3d3'}
            circleInActiveColor={'#d3d3d3'}
          />
        </View>

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>سونا و جکوزی</Text>
          <Switch
            value={false}
            onValueChange={(hotTub) => this.setState({ hotTub })}
            disabled={false}
            activeText={'بله'}
            inActiveText={'خیر'}
            backgroundActive={'green'}
            backgroundInactive={'#a9a9a9'}
            circleActiveColor={'#d3d3d3'}
            circleInActiveColor={'#d3d3d3'}
          />
        </View>

      </ScrollView>

      <View style={styles.buttonWrapper}>
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>
          ادامه
        </Text>
      </TouchableOpacity>
      </View>
      </View>
    );
  }
}

const CONTINUE_BUTTON_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionContainer: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: CONTINUE_BUTTON_HEIGHT + 10,
  },
  optionItemStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 100,
    height: CONTINUE_BUTTON_HEIGHT,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default AddListingSixthStep;
