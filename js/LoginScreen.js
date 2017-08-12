import React , { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';


class LoginScreen extends Component {
  state = { email: '', password: '', error: '', loading: false };

  onButtonPress() {
    console.log(this.state.email);
    console.log(this.state.password);
    this.props.navigation.navigate('verification');
  }

  onLoginFail() {
    this.setState({ error: 'Authentication Failed', loading: false });
  }

  onLoginSuccess() {
    this.setState({
      email: '',
      password: '',
      loading: false,
      error: ''
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button onPress={this.onButtonPress.bind(this)}>
        ورود
      </Button>
    );
  }

  render(){
    return(
      <View style={styles.backgroundTheme} >
      <Card >
        <CardSection>
          <Input
            placeholder="ahmad"
            label="نام کاربری"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </CardSection>

        <CardSection>
          <Input
            secureTextEntry
            placeholder="123"
            label="رمز عبور"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
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
  backgroundTheme: {
    flex: 1,
    backgroundColor: '#ADD8E6',
  },
  emailInputStyle: {
    height: 20,
    width: 100
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
});

export default LoginScreen;
