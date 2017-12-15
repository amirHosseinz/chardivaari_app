import React, { Component } from 'react';
import { Alert, ScrollView, View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-switch';
import Stepper from 'react-native-stepper';
import Icon from 'react-native-vector-icons/MaterialIcons';

class AddListingSeventhStep extends Component {
  constructor() {
    super();
    this.state = {
      pet: false,
      acceptPetButtonColor: '#d3d3d3',
      rejectPetButtonColor: '#d3d3d3',
      petValue: 10,
      smoke: false,
      acceptSmokeButtonColor: '#d3d3d3',
      rejectSmokeButtonColor: '#d3d3d3',
      smokeValue: 10,
      party: false,
      acceptPartyButtonColor: '#d3d3d3',
      rejectPartyButtonColor: '#d3d3d3',
      partyValue: 10,
    };
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingEighthStep');
  }

  onChangePetStepper(value) {
    // todo
    if (value>this.state.petValue){
      // this means accept the law
      this.setState({ acceptPetButtonColor: 'green' });
      this.setState({ rejectPetButtonColor: '#d3d3d3' });
      this.setState({ pet: true });
    } else {
      // this means reject the law
      this.setState({ rejectPetButtonColor: 'green' });
      this.setState({ acceptPetButtonColor: '#d3d3d3' });
      this.setState({ pet: false });
    }
    this.setState({ petValue: value });
  }

  onChangeSmokeStepper(value) {
    // todo
    if (value>this.state.smokeValue){
      // this means accept the law
      this.setState({ acceptSmokeButtonColor: 'green' });
      this.setState({ rejectSmokeButtonColor: '#d3d3d3' });
      this.setState({ smoke: true });
    } else {
      // this means reject the law
      this.setState({ rejectSmokeButtonColor: 'green' });
      this.setState({ acceptSmokeButtonColor: '#d3d3d3' });
      this.setState({ smoke: false });
    }
    this.setState({ smokeValue: value });
  }

  onChangePartyStepper(value) {
    // todo
    if (value>this.state.petValue){
      // this means accept the law
      this.setState({ acceptPartyButtonColor: 'green' });
      this.setState({ rejectPartyButtonColor: '#d3d3d3' });
      this.setState({ party: true });
    } else {
      // this means reject the law
      this.setState({ rejectPartyButtonColor: 'green' });
      this.setState({ acceptPartyButtonColor: '#d3d3d3' });
      this.setState({ party: false });
    }
    this.setState({ partyValue: value });
  }

  render() {
    return(
      <View style={styles.container}>
      <ScrollView style={styles.optionContainer} >

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>حیوان خانگی</Text>
          <Stepper
            initValue={10}
            minValue={0}
            stepValue={1}
            style={stepperStyle}
            decreaseComponent={<Icon size={35} color={this.state.rejectPetButtonColor} name={'close'} style={stepperStyle.iconStyle} />}
            increaseComponent={<Icon size={35} color={this.state.acceptPetButtonColor} name={'check'} style={stepperStyle.iconStyle} />}
            valueChanged={(value) => this.onChangePetStepper(value)}
            ignoreMinValidation={true}
            ignoreMaxValidation={true}
          />
        </View>

        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>سیگار</Text>
          <Stepper
            initValue={10}
            minValue={0}
            stepValue={1}
            style={stepperStyle}
            decreaseComponent={<Icon size={35} color={this.state.rejectSmokeButtonColor} name={'close'} style={stepperStyle.iconStyle} />}
            increaseComponent={<Icon size={35} color={this.state.acceptSmokeButtonColor} name={'check'} style={stepperStyle.iconStyle} />}
            valueChanged={(value) => this.onChangeSmokeStepper(value)}
            ignoreMinValidation={true}
            ignoreMaxValidation={true}
          />
        </View>
        <View style={styles.optionItemStyle} >
          <Text style={styles.text}>مهمانی</Text>
          <Stepper
            initValue={10}
            minValue={0}
            stepValue={1}
            style={stepperStyle}
            decreaseComponent={<Icon size={35} color={this.state.rejectPartyButtonColor} name={'close'} style={stepperStyle.iconStyle} />}
            increaseComponent={<Icon size={35} color={this.state.acceptPartyButtonColor} name={'check'} style={stepperStyle.iconStyle} />}
            valueChanged={(value) => this.onChangePartyStepper(value)}
            ignoreMinValidation={true}
            ignoreMaxValidation={true}
          />
        </View>

      </ScrollView>

      <View style={styles.buttonWrapper} >
      <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonStyle} >
        <Text style={styles.textStyle} >
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

const stepperStyle = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row'
  },
  decreaseButtonStyle: {
    padding: 0,
    borderWidth: 1,
    borderRightWidth: 1,
    borderColor: 'green',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  increaseButtonStyle: {
    padding: 0,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'green',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }
});

export default AddListingSeventhStep;
