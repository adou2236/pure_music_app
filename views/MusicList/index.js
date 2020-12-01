import React, {Component} from 'react';
import {View, FlatList, Text, RefreshControl} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

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
    const {musicList, currentPlaying, refreshing, mode} = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.id + ''}
          onRefresh={() => {
            mode === 'net' && musicList.length > 0 ? this.props.refresh() : '';
          }}
          onEndReachedThreshold={0}
          onEndReached={() => {
            mode === 'net' ? this.props.endReach() : '';
          }}
          refreshing={refreshing === 'up'}
          renderItem={({item}) => (
            <ListObj
              isPlaying={
                currentPlaying
                  ? item.music_id === currentPlaying.element.music_id
                  : false
              }
              addToList={this.addToList}
              selectMusic={this.selectMusic}
              removeMusic={this.removeMusic}
              item={item}
              mode={mode}
            />
          )}
        />
        {mode === 'net' ? (
          <ActivityIndicator animating={refreshing === 'bottom'} />
        ) : null}
      </View>
    );
  }
}
