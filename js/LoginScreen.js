import React , { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
// import { fetch } from 'fetch';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';


class LoginScreen extends Component {
  state = {
    username: '',
    password: '',
    error: '',
    loading: false,
  };

  onButtonPress() {
    // TODO
    // fetch doesnt work
    console.log(this.state.username);
    console.log(this.state.password);

    this.setState({
      loading: true,
    });

    fetch('https://www.zorozadeh.com/auth/api-token-auth/', {
    // fetch('http://192.168.12.100:8000/auth/api-token-auth/', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
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
    body = JSON.parse(response._bodyText);
    if (response.status === 200) {
      this.setState({
        token: body.token,
        error: '',
        loading: false,
       });
       // TODO
       // after login should read from cache to go to guest or host screen
       this.props.navigation.navigate('guestScreen');
       // Alert.alert(String(body.token));
    } else {
      this.onLoginFail();
    }
  }

  onLoginFail() {
    this.setState({
      error: 'نام کاربری یا رمز عبور اشتباه است.',
      loading: false,
    });
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

export default LoginScreen;
