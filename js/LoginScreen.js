import React , { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import CacheStore from 'react-native-cache-store';
// import { fetch } from 'fetch';

import Card from './common/Card';
import CardSection from './common/CardSection';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';
import { testURL, productionURL } from './data';

class LoginScreen extends Component {
  state = {
    username: '',
    password: '',
    error: '',
    loading: false,
  };

  onButtonPress() {
    this.setState({
      loading: true,
    });

    fetch(productionURL + '/auth/api-token-auth/', {
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
      this.onLoginFail('خطای شبکه، لطفا پس از اطمینان از اتصال اینترنت مجدد تلاش کنید.');
      // console.error(error);
    });
  }

  onResponseRecieved(response) {
    this.setState({
      loading: false,
    });

    if (response.status === 200) {
      body = JSON.parse(response._bodyText);
      this.setState({
        token: body.token,
        error: '',
        loading: false,
       });
       // TODO
       // after login should read from cache to go to guest or host screen
       CacheStore.set('token', body.token);
       CacheStore.set('username', this.state.username);
       this.props.navigation.navigate('guestScreen');
    } else if (response.status === 400) {
      body = JSON.parse(response._bodyText);
      this.onLoginFail('نام کاربری یا رمز عبور اشتباه است.');
    } else {
      this.onLoginFail('خطایی رخ داده است.');
    }
  }

  onLoginFail(errorText) {
    this.setState({
      error: errorText,
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
  },
});

export default LoginScreen;
