import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import * as ImageManipulator from 'expo-image-manipulator';

class LoginTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      remember: false,
    };
  }

  static navigationOptions = {
    title: 'Login',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='sign-in'
        type='font-awesome'
        iconStyle={{ color: tintColor }}
      />
    ),
  };

  handleLogin() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      ).catch((error) => console.log('Could not save user info', error));
    } else {
      SecureStore.deleteItemAsync('userinfo').catch((error) =>
        console.log('Could not delete user info', error),
      );
    }
  }

  componentDidMount() {
    SecureStore.getItemAsync('userinfo').then((userdata) => {
      const userinfo = JSON.parse(userdata);
      if (userinfo) {
        this.setState({ username: userinfo.username });
        this.setState({ password: userinfo.password });
        this.setState({ remember: true });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          placeholder='Username'
          leftIcon={{ type: 'font-awesome', name: 'user-o' }}
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <Input
          placeholder='Password'
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          containerStyle={styles.formInput}
          leftIconContainerStyle={styles.formIcon}
        />
        <CheckBox
          title='Remember Me'
          center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })}
          containerStyle={styles.formCheckbox}
        />
        <View style={styles.formButton}>
          <Button
            onPress={() => this.handleLogin()}
            title='Login'
            icon={
              <Icon
                name='sign-in'
                type='font-awesome'
                color='#fff'
                iconStyle={{ marginRight: 10 }}
              />
            }
            buttonStyle={{ backgroundColor: '#5637DD' }}
          />
        </View>
        <View style={styles.formButton}>
          <Button
            onPress={() => this.props.navigation.navigate('Register')}
            title='Register'
            type='clear'
            icon={
              <Icon
                name='user-plus'
                type='font-awesome'
                color='blue'
                iconStyle={{ marginRight: 10 }}
              />
            }
            titleStyle={{ color: 'blue' }}
          />
        </View>
      </View>
    );
  }
}

class RegisterTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      remember: false,
      imageUrl:
        '/Users/jacquelynhagman/workspaces/gitrepos/Nucamp-React-Native/components/images/logo.png',
      ready: false,
      error: '',
    };
  }

  componentDidMount = async () => {
    this.setState({
      ready: true,
    });
  };

  static navigationOptions = {
    title: 'Register',
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='user-plus'
        type='font-awesome'
        iconStyle={{ color: tintColor }}
      />
    ),
  };

  getImageFromCamera = async () => {
    try {
      // expect alert or modal to pop up asking if its ok to use the camera
      const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
      // expect alert or modal to pop up asking if its ok to use the photos gallery
      const cameraRollPermission = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
      );
      // if a user chooses ok or accapted for both the camera permission question and the camera roll/gallery question
      // then assign the result of the ImagePicker.launchCameraAsync to the capturedImage function. This will allow the user to edit the photo and
      // assign an 1:1 aspect ratio
      if (
        cameraPermission.status === 'granted' &&
        cameraRollPermission.status === 'granted'
      ) {
        const capturedImage = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
        });
        // if a user takes a picture and does not cancel is log the image data to the console
        // and change the value of the imageUrl in state to the new uri from the capturedImage object
        if (!capturedImage.cancelled) {
          console.log(capturedImage);
          this.setState({ imageUrl: capturedImage.uri }, () => {
            'Line 180 in Login Component, logging state immediately after setting the imageUrl to the capturedImage.uri when a user takes a pic',
              { state: this.state };
          });
        }
      }
      console.log('logging state at like 185 in Login Component', {
        state: this.state,
      });
      this.processImage(this.state.imageUrl);
    } catch (error) {
      this.setState(
        {
          error: 'error taking user pic',
        },
        () =>
          console.log('logging error in captureImage', { state: this.state }),
      );
    }
  };

  getImageFromGallery = async () => {
    try {
      const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);

      const cameraRollPermission = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
      );

      if (
        cameraPermission.status === 'granted' &&
        cameraRollPermission.status === 'granted'
      ) {
        const capturedImage = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        this.setState({
          imageUrl: capturedImage.uri,
        });
        this.processImage(this.state.imageUrl);

        if (!capturedImage.cancelled) {
          console.log(capturedImage);
          this.setState({ imageUrl: capturedImage.uri }, () => {
            'Line 180 in Login Component, logging state immediately after setting the imageUrl to the capturedImage.uri when a user takes a pic',
              { state: this.state };
          });
        }
      }
    } catch (error) {
      this.setState(
        {
          error: 'error getting image from gallery',
        },
        () => console.log({ state: this.state }),
      );
    }
  };

  processImage = async (imgUri) => {
    try {
      const processedImage = await ImageManipulator.manipulateAsync(
        imgUri,

        [{ resize: { height: 400 } }],
        {
          format: ImageManipulator.SaveFormat.PNG,
        },
      );
      console.log('line 211', { processedImage });
      this.setState(
        {
          imageUrl: processedImage.uri,
        },
        () =>
          console.log('line 217 checking if imageUrl has changed', {
            state: this.state,
          }),
      );
    } catch (error) {
      this.setState(
        {
          error,
        },
        () => console.log({ state: this.state }),
      );
    }
  };

  handleRegister() {
    console.log(JSON.stringify(this.state));
    if (this.state.remember) {
      SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      ).catch((error) => console.log('Could not save user info', error));
    } else {
      SecureStore.deleteItemAsync('userinfo').catch((error) =>
        console.log('Could not delete user info', error),
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: this.state.imageUrl }}
              loadingIndicatorSource={require('./images/logo.png')}
              style={styles.image}
            />

            <Button title='Camera' onPress={this.getImageFromCamera} />
            <Button title='Gallery' onPress={this.getImageFromGallery} />
          </View>
          <Input
            placeholder='Username'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(username) => this.setState({ username })}
            value={this.state.username}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder='Password'
            leftIcon={{ type: 'font-awesome', name: 'key' }}
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder='First Name'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(firstname) => this.setState({ firstname })}
            value={this.state.firstname}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder='Last Name'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            onChangeText={(lastname) => this.setState({ lastname })}
            value={this.state.lastname}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <Input
            placeholder='Email'
            leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            containerStyle={styles.formInput}
            leftIconContainerStyle={styles.formIcon}
          />
          <CheckBox
            title='Remember Me'
            center
            checked={this.state.remember}
            onPress={() => this.setState({ remember: !this.state.remember })}
            containerStyle={styles.formCheckbox}
          />
          <View style={styles.formButton}>
            <Button
              onPress={() => this.handleRegister()}
              title='Register'
              icon={
                <Icon
                  name='user-plus'
                  type='font-awesome'
                  color='#fff'
                  iconStyle={{ marginRight: 10 }}
                />
              }
              buttonStyle={{ backgroundColor: '#5637DD' }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const Login = createBottomTabNavigator(
  {
    Login: LoginTab,
    Register: RegisterTab,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#5637DD',
      inactiveBackgroundColor: '#CEC8FF',
      activeTintColor: '#fff',
      inactiveTintColor: '#808080',
      labelStyle: { fontSize: 16 },
    },
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 10,
  },
  formIcon: {
    marginRight: 10,
  },
  formInput: {
    padding: 8,
  },
  formCheckbox: {
    margin: 8,
    backgroundColor: null,
  },
  formButton: {
    margin: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
});

export default Login;
