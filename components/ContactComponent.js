import React, { Component } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class Contact extends Component {
  static navigationOptions = {
    title: 'Contact Us',
  };

  render() {
    return (
      <ScrollView>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
          <Card title='Contact Information'>
            <Text>1 Nucamp Way </Text>
            <Text>Seattle, WA 98001 </Text>
            <Text style={{ marginBottom: 10 }}>U.S.A </Text>

            <Text>Phone:1-206-555-1234</Text>
            <Text>Email: campsites@nucamp.co</Text>
          </Card>
        </Animatable.View>
      </ScrollView>
    );
  }
}

export default Contact;
