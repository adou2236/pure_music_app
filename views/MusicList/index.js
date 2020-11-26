import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import ListObj from './listObj';
import {Button, IconButton, List, Menu} from 'react-native-paper';

export default class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }
  componentDidMount() {}

  //移除列表中的曲目
  removeMusic = (v) => {
    this.props.listAction('remove', v);
  };

  //选择一条曲目唯一播放
  selectMusic = (v) => {
    this.props.listAction('select', v);
  };

  //加入到播放列表
  addToList = (v, m) => {
    //m 模式，放入下一曲或者队尾
    this.props.listAction(m, v);
  };
  render() {
    const {musicList} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.uuid}
          renderItem={({item}) => (
            <ListObj
              addToList={this.addToList}
              selectMusic={this.selectMusic}
              removeMusic={this.removeMusic}
              item={item}
              mode={this.props.mode}
            />
          )}
        />
      </View>
    );
  }
}
