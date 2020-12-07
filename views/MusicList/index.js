import React, {Component} from 'react';
import {View, FlatList, Text, RefreshControl} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';

import ListObj from './listObj';

export default class MusicList extends Component {
  constructor(props) {
    super(props);
    console.log('歌曲列表', props.musicList);
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
    const {
      loadAction = false,
      musicList,
      currentPlaying,
      refreshing,
      mode,
      withAnimation,
    } = this.props;
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.id + ''}
          onRefresh={() => {
            loadAction && musicList.length > 0 ? this.props.refresh() : '';
          }}
          onEndReachedThreshold={1}
          onEndReached={() => {
            loadAction ? this.props.endReach() : '';
          }}
          refreshing={refreshing === 'up'}
          renderItem={({item, index}) => (
            <ListObj
              isPlaying={
                currentPlaying
                  ? item.music_id === currentPlaying.element.music_id
                  : false
              }
              addToList={this.addToList}
              selectMusic={this.selectMusic}
              removeMusic={this.removeMusic}
              index={index}
              item={item}
              mode={mode}
              withAnimation={withAnimation}
            />
          )}
        />
        {loadAction ? (
          <ActivityIndicator animating={refreshing === 'bottom'} />
        ) : null}
      </View>
    );
  }
}
