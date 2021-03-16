import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import { Card, Rating, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite,
  postComment,
};

function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
      <Card featuredTitle={campsite.name} image={{ uri: campsite.image }}>
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
        <Rating
          readonly={true}
          imageSize={10}
          startingValue={item.rating}
          style={{
            fontSize: 12,
            alignItems: 'flex-start',
            paddingVertical: '5%',
          }}
        >
          {item.rating}
        </Rating>
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

const initialState = {
  showModal: false,
  rating: 5,
  author: '',
  text: '',
};
class CampsiteInfo extends Component {
  state = {
    showModal: false,
    rating: 4,
    author: '',
    text: '',
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
  handleComment = (campsiteId = 0) => {
    this.props.postComment(
      campsiteId,
      this.state.rating,
      this.state.author,
      this.state.comment,
    );
    this.toggleModal();
  };
  resetForm = () => {
    this.setState({ ...initialState });
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
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modal}>
            <Rating
              startingValue={10}
              imageSize={60}
              showRating
              onFinishRating={(rating) => this.setState({ rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder='author'
              leftIconContainerStyle={{ paddingRight: 10 }}
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              style={styles}
              onChangeText={(value) => this.setState({ author: value })}
              value={this.state.author}
            />
            <Input
              placeholder='comment'
              leftIconContainerStyle={{ paddingRight: 10 }}
              leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
              style={styles}
              onChangeText={(value) => this.setState({ text: value })}
              value={this.state.value}
            />

            <View>
              <Button
                title='Submit'
                color='#5637DD'
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}
              ></Button>
            </View>

            <View>
              <Button
                title='Cancel'
                color='#5637DD'
                onPress={() => {
                  this.props.handleComment();
                  this.props.resetForm();
                }}
              ></Button>
            </View>
          </View>
          <View>
            <Text> {/*JSON.stringify({ state: this.state })*/}</Text>
          </View>
          <View>
            <Text>{JSON.stringify({ state: this.state }, null, 2)}</Text>
          </View>
        </Modal>

        <RenderComments comments={comments} />
        <View>
          <Text>{JSON.stringify({ state: this.state }, null, 2)}</Text>
        </View>
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
