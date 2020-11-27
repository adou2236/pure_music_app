import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import ListObj from './listObj';

export default class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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
    const {musicList, currentPlaying} = this.props;
    console.log('正在播放', currentPlaying);
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.uuid}
          renderItem={({item}) => (
            <ListObj
              isPlaying={
                currentPlaying
                  ? item.uuid === currentPlaying.element.uuid
                  : false
              }
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
