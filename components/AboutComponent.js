import React, { Component } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Avatar, ListItem } from 'react-native-elements';
import { Text, View, FlatList, Image, StyleSheet } from 'react-native';
import { PARTNERS } from '../shared/partners';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
const Item = ({ name, image, description }) => (
  <View>
    <ListItem
      title={name}
      subtitle={description}
      leftAvatar={
        <Avatar
          rounded
          source={{
            uri: image,
          }}
        />
      }
    />
  </View>
);

class About extends Component {
  static navigationOptions = {
    title: 'About Us',
  };

  renderItem = ({ item }) => (
    <Item name={item.name} image={item.image} description={item.description} />
  );

  render() {
    return (
      
      
        <View>
        <Card title='Our Mission'>
          <Text>
            We present a curated database of the best campsites in the vast
            woods and backcountry of the World Wide Web Wilderness. We increase
            access to adventure for the public while promoting safe and
            respectful use of resources. The expert wilderness trekkers on our
            staff personally verify each campsite to make sure that they are up
            to our standards. We also present a platform for campers to share
            reviews on campsites they have visited with each other.
          </Text>
        </Card>
        <ScrollView>
        <Card title='Community Partners'>
          <FlatList
            data={PARTNERS}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
          />
        </Card>
        </ScrollView>
        </View>
      
     
    );
  }
}

export default About;
