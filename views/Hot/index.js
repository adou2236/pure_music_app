import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Button, Text, Surface} from 'react-native-paper';
import {debounce} from '../../unit/fn';
import {playerStyle} from '../../style/style';
import {getHotList} from '../../http/api';
import MusicList from '../MusicList';

export default class Hot extends Component {
  constructor(props) {
    super(props);
    this.getHotList = debounce(this.getHotList, 300);
    this.state = {
      active: 1,
      refreshing: false,
      buttonContent: {0: '总榜', 1: '最新'},
      fsuc: 'absolute',
      typeList: [
        {id: 1, name: '华语'},
        {id: 15, name: '日韩'},
        {id: 10, name: '欧美'},
        {id: 11, name: 'Remix'},
        {id: 12, name: '纯音乐'},
        {id: 13, name: '二次元'},
      ],
      listData: [],
    };
  }
  componentDidMount() {
    this.getHotList();
  }
  getHotList = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        let data = {
          newset: Boolean(this.state.active),
        };
        getHotList(data).then((res) => {
          this.setState({
            listData: res.data.content,
            refreshing: false,
          });

          // for (let i = 0; i < res.data.content.length; i++) {
          //   (function (a) {
          //     setTimeout(() => {
          //       self.setState({
          //         listData: self.state.listData.concat(res.data.content[a]),
          //       });
          //     }, i * 100);
          //   })(i);
          // }
        });
      },
    );
  };
  changeList = () => {
    this.setState(
      {
        active: 1 ^ this.state.active,
        listData: [],
      },
      () => {
        this.getHotList();
      },
    );
  };
  toTopPage = (item) => {
    this.props.navigation.navigate('TopPage', {id: item.id, name: item.name});
  };
  render() {
    const {navigation, currentPlaying} = this.props;
    const {typeList, buttonContent, active, listData} = this.state;
    return (
      <View style={{flex: 1, height: '100%'}}>
        <View style={playerStyle.typeList}>
          {typeList.map((item, index) => {
            return (
              <Surface key={item.id} style={playerStyle.typeBox}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.toTopPage(item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              </Surface>
            );
          })}
        </View>
        <View style={{flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Text>排行榜</Text>
            <Button onPress={this.changeList}>{buttonContent[active]}</Button>
          </View>
          <MusicList
            withAnimation={true}
            listAction={this.props.listAction}
            musicList={listData}
            currentPlaying={currentPlaying}
            mode={'net'}
          />
        </View>
      </View>
    );
  }
}
