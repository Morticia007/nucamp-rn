import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import { Card, Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
};

function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
      <Card
        featuredTitle={campsite.name}
        image={{ uri: baseUrl + campsite.image }}
      >
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            name={props.favorite ? 'heart' : 'heart-o'}
            type='font-awesome'
            color='#f50'
            raisedreversed
            onPress={() =>
              props.favorite
                ? console.log('Already set as favorite')
                : props.markFavorite()
            }
          />
          <Icon
            name={'pencil'}
            type='font-awesome'
            color='#5637DD'
            raisedreversed
            onPress={() => props.toggleModal()}
          />
        </View>
      </Card>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating}Stars</Text>
        <Text style={{ fontSize: 12 }}>{`--${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Card title='comments'>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

class CampsiteInfo extends Component {
  state = {
    showModal: false,
  };

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  toggleModal = () => {
    console.log({
      showModal: this.state.showModal,
    });
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  static navigationOptions = {
    title: 'Campsite Information',
  };

  render() {
    const campsiteId = this.props.navigation.getParam('campsiteId');
    const campsite = this.props.campsites.campsites.filter(
      (campsite) => campsite.id === campsiteId,
    )[0];
    const comments = this.props.comments.comments.filter(
      (comment) => comment.campsiteId === campsiteId,
    );
    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          toggleModal={this.toggleModal}
        />
        <RenderComments comments={comments} />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modal}>
            <View style={{ margin: 10 }}>
              <Button
                title='Cancel'
                color={'#808080'}
                onPress={() => this.toggleModal()}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  buttonStyle: {
    backgroundColor: 'blue',
    borderRadius: 60,
    flex: 1,
    height: 30,
    width: 30,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
