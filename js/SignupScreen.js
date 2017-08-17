import React , { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';


class SignupScreen extends Component {

  constructor(props) {
    super(props);

    this.state={
      firstName: '',
      lastName: '',
      cellPhoneNo: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
    };
  }

  onButtonPress() {
    // TODO
    // fetch doesnt work
    console.log(this.state.username);
    console.log(this.state.password);

    this.setState({
      loading: true,
    });

    fetch('https://www.zorozadeh.com/auth/signup/', {
    // fetch('http://192.168.1.101:8000/auth/signup/', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        confirm_password: this.state.confirmPassword,
      }),
    })
    .then((response) => this.onResponseRecieved(response))
    .catch((error) => {
      console.error(error);
    });
  }

  onResponseRecieved(response) {
    this.setState({
      loading: false,
    });
    // console.log('injaaaaakkkk');
    // console.log(response);
    // Alert.alert(String(response.status));
    if (response.status === 201) {
      this.props.navigation.navigate('verification');
    } else {
      this.onLoginFail();
    }
  }

  onLoginFail() {
    this.setState({ error: 'خطا رخ داده.', loading: false });
  }

  onLoginSuccess() {
    this.setState({
      username: '',
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
            placeholder="ahmad@example.com"
            label="ایمیل یا شماره تلفن همراه"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
        </CardSection>

        <CardSection>
          <Input
            placeholder="ahmad"
            label="نام کاربری"
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
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

        <CardSection>
          <Input
            secureTextEntry
            placeholder="123"
            label="تکرار رمز عبور"
            value={this.state.confirmPassword}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
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
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
});

export default SignupScreen;
