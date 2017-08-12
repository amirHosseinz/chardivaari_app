import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import PhotoUpload from 'react-native-photo-upload';
import Icon from 'react-native-vector-icons/MaterialIcons';

class AddListingEighthStep extends Component {

  constructor() {
    super();
    this.state={photos: [],};
  }

  renderPhotos() {
    return this.state.photos.map(photo =>
      <Image key={photo} style={styles.imageStyle} source={{ uri: photo}} />
    );
  }

  onButtonPress() {
    const {navigate} = this.props.navigation;
    navigate('addListingNinthStep');
  }

  render() {
    return(
      <View style={styles.container}>
      <ScrollView style={styles.optionContainer} >

        <View style={styles.optionItemStyle} >
        <PhotoUpload
          onPhotoSelect={avatar => {
            if (avatar) {
              // console.log('Image base64 string: ', avatar)
              Alert.alert(avatar);
              photosList = this.state.photos;
              photosList.push(avatar);
              this.setState({ photos: photosList });
            }
          }}
        >

        <View style={styles.addingPhotos} >
          <Text style={styles.text} >اضافه کردن</Text>
          <Icon size={40} color="black" name="add" style={styles.addPhotoIconStyle} />
        </View>

        </PhotoUpload>
        </View>

        <View>
          {this.renderPhotos()}
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
    marginTop: 30,
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
    fontSize: 25,
    color: 'black',
    paddingRight: 5,
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
  addingPhotos: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'gray',
    borderWidth: 3,
    borderRadius: 40,
    borderColor: 'green',
    width: Dimensions.get('screen').width - 20,
  },
  addPhotoIconStyle: {
    paddingLeft: 5,
  },
  imageStyle: {
    width: 100,
    height: 100,
  },
});

export default AddListingEighthStep;
