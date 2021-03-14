import React, { Component } from 'react';
import { Text, ScrollView, FlatList, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

const mapStateToProps = (state) => {
  return {
    partners: state.partners,
  };
};

function Mission() {
  return (
    <Card title='Our Mission'>
      <Text style={{ margin: 10 }}>
        We present a curated database of the best campsites in the vast woods
        and backcountry of the World Wide Web Wilderness. We increase access to
        adventure for the public while promoting safe and respectful use of
        resources. The expert wilderness trekkers on our staff personally verify
        each campsite to make sure that they are up to our standards. We also
        present a platform for campers to share reviews on campsites they have
        visited with each other.
      </Text>
    </Card>
  );
}

class About extends Component {
  static navigationOptions = {
    title: 'About Us',
  };

  renderPartner = ({ item }) => {
    return (
      <ListItem
        title={item.name}
        subtitle={item.description}
        leftAvatar={{ source: { uri: item.image } }}
      />
    );
  };

  render() {
    if (this.props.partners.isLoading) {
      return (
        <ScrollView>
          <Mission />
          <Card title='Community Partners'>
            <Loading />
          </Card>
        </ScrollView>
      );
    }
    if (this.props.partners.errMess) {
      return (
        <ScrollView>
          <Mission />
          <Card title='Community Partners'>
            <Text>{this.props.partners.errMess}</Text>
          </Card>
        </ScrollView>
      );
    }
    return (
      <ScrollView>
        <Mission />
        <View>
          <FlatList
            renderItem={this.renderPartner}
            keyExtractor={(item) => item.id}
            data={this.props.partners.partners}
          />
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(About);
