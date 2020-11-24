import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import {Button, IconButton, List} from 'react-native-paper';

export default class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  removeMusic = (v) => {
    this.props.listAction('remove', v);
  };

  selectMusic = (v) => {
    this.props.listAction('select', v);
  };
  render() {
    const {musicList} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.uuid}
          renderItem={({item}) => (
            <List.Item
              title={item.name}
              description={item.artist}
              onPress={() => this.selectMusic(item)}
              right={(props) =>
                this.props.mode === 'local' ? (
                  <IconButton
                    {...props}
                    onPress={() => this.removeMusic(item)}
                    icon="delete-outline"
                  />
                ) : (
                  <IconButton
                    {...props}
                    onPress={() => console.log('Pressed')}
                    icon="dots-vertical"
                  />
                )
              }
            />
          )}
        />
      </View>
    );
  }
}
