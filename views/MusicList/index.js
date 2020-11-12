import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {List} from 'react-native-paper';

export default class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: [
        {id: '1', name: '音乐1', url: 'www.baidu.com'},
        {id: '2', name: '音乐2', url: 'www.baidu.com'},
        {id: '3', name: '音乐3', url: 'www.baidu.com'},
        {id: '4', name: '音乐4', url: 'www.baidu.com'},
        {id: '5', name: '音乐5', url: 'www.baidu.com'},
        {id: '6', name: '音乐6', url: 'www.baidu.com'},
        {id: '7', name: '音乐7', url: 'www.baidu.com'},
        {id: '8', name: '音乐8', url: 'www.baidu.com'},
        {id: '9', name: '音乐9', url: 'www.baidu.com'},
        {id: '10', name: '音乐10', url: 'www.baidu.com'},
        {id: '11', name: '音乐11', url: 'www.baidu.com'},
        {id: '12', name: '音乐12', url: 'www.baidu.com'},
        {id: '13', name: '音乐13', url: 'www.baidu.com'},
        {id: '14', name: '音乐14', url: 'www.baidu.com'},
        {id: '15', name: '音乐15', url: 'www.baidu.com'},
        {id: '16', name: '音乐16', url: 'www.baidu.com'},
        {id: '17', name: '音乐17', url: 'www.baidu.com'},
        {id: '18', name: '音乐18', url: 'www.baidu.com'},
        {id: '19', name: '音乐19', url: 'www.baidu.com'},
      ],
    };
  }
  render() {
    const {musicList} = this.state;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          renderItem={({item}) => (
            <List.Item
              title={item.name}
              right={(props) => <List.Icon {...props} icon="folder" />}
            />
          )}
        />
      </View>
    );
  }
}
