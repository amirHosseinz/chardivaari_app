import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableHighlight,
} from 'react-native';

import LoginScreen from './LoginScreen';
import Card from './common/Card';
import CardSection from './common/CardSection';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';

class LoginVerificationScreen extends Component {
  state = { verification_code: '', error: '', loading: false };

  onButtonPress() {
    // todo
    // check verification code from server
    this.props.navigation.navigate('main');
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button style={styles.button} onPress={this.onButtonPress.bind(this)}>
        ورود
      </Button>
    );
  }

  render() {
    return (
      <View style={styles.container} >
      <Card >
        <CardSection>
          <Input
            label="کد تایید"
            placeholder='1234'
            value={this.state.verification_code}
            onChangeText={verification_code => this.setState({ verification_code })}
          />
        </CardSection>

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
  },
  button:{
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d6d7da',
    padding: 13,
  },
});

export default LoginVerificationScreen;
