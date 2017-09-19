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
import { testURL, productionURL } from './data';


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
    this.setState({
      loading: true,
    });

    fetch(productionURL + '/auth/signup/', {
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
      this.onLoginFail('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
      // console.error(error);
    });
  }

  onResponseRecieved(response) {
    this.setState({
      loading: false,
    });
    if (response.status === 201) {
      this.props.navigation.navigate('verification');
    } else if (response.status === 400) {
      body = JSON.parse(response._bodyText);
      if ('confirm_password' in body) {
        this.onLoginFail('دو رمز عبور وارد شده یکسان نیست.');
      } else if ('username' in body) {
        this.onLoginFail('این نام کاربری قبلا گرفته شده است.');
      } else if ('email' in body) {
        if (body.email === 'email already exists.') {
          this.onLoginFail('ایمیل قبلا گرفته شده است.');
        } else {
          this.onLoginFail('ایمیل شما معتبر نمی‌باشد.');
        }
      }
    } else {
      this.onLoginFail('خطایی رخ داده');
    }
  }

  onLoginFail(errorText) {
    this.setState({
      error: errorText,
      loading: false });
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
