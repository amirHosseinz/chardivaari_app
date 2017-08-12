import React, { Component } from 'react';
import { Alert, ScrollView, View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-switch';

class AddListingFifthStep extends Component {
  constructor() {
    super();
    this.state = {
      tv: false,
      wifi: false,
      iron: false,
      cooler: false,
      sofa: false,
      elevator: false,
      hangers: false,
      farangiwc: false,
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingSixthStep');
  }

  render() {
    return(
      <View style={styles.container}>
      <ScrollView style={styles.optionContainer} >
        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>تلویزیون</Text>
          <Switch
            value={false}
            onValueChange={(tv) => this.setState({ tv })}
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
          <Text style={styles.text}>Wifi</Text>
          <Switch
            value={false}
            onValueChange={(wifi) => this.setState({ wifi })}
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
          <Text style={styles.text}>اتو</Text>
          <Switch
            value={false}
            onValueChange={(iron) => this.setState({ iron })}
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
          <Text style={styles.text}>کولر</Text>
          <Switch
            value={false}
            onValueChange={(cooler) => this.setState({ cooler })}
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
          <Text style={styles.text}>مبل راحتی</Text>
          <Switch
            value={false}
            onValueChange={(sofa) => this.setState({ sofa })}
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
          <Text style={styles.text}>آسانسور</Text>
          <Switch
            value={false}
            onValueChange={(elevator) => this.setState({ elevator })}
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
          <Text style={styles.text}>چوب لباسی</Text>
          <Switch
            value={false}
            onValueChange={(hangers) => this.setState({ hangers })}
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
          <Text style={styles.text}>توالت فرنگی</Text>
          <Switch
            value={false}
            onValueChange={(farangiwc) => this.setState({ farangiwc })}
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

export default AddListingFifthStep;
