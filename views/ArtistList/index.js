import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {getHotAuthor} from '../../http/api';
import AuthorObj from './authorObj';

export default class ArtistList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorList: [],
    };
  }
  componentDidMount() {
    getHotAuthor()
      .then((res) => {
        this.setState({
          authorList: res.artists,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const {authorList} = this.state;
    return (
      <View
        style={{
          marginVertical: 10,
        }}>
        <FlatList
          numColumns={4}
          data={authorList}
          renderItem={(item) => (
            <AuthorObj navigation={this.props.navigation} {...item} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}
