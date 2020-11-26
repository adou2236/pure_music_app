import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Searchbar, IconButton, Button} from 'react-native-paper';
import MusicList from '../MusicList';
import {getAllMusic} from '../../http/api';

export default class Search extends Component {
  constructor(props) {
    super(props);
    console.log('AAAAAAA', props);
    this.state = {
      searchQuery: '',
      musicList: [],
    };
  }

  onChangeSearch = (v) => {
    this.setState({
      searchQuery: v,
    });
  };

  search = () => {
    let params = {
      keywords: this.state.searchQuery,
    };
    getAllMusic(params).then((res) => {
      console.log('搜索结果为', res);
      if (res.length !== 0) {
        this.setState({
          musicList: res,
        });
      }
    });
  };

  render() {
    const {searchQuery, musicList} = this.state;
    const {navigation} = this.props;
    return (
      <View style={{height: '100%'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: this.props.theme.colors.surface,
          }}>
          <IconButton icon="arrow-left" onPress={() => navigation.pop()} />
          <Searchbar
            icon={null}
            style={{
              width: '60%',
              borderRadius: 25,
              shadowOpacity: 0,
            }}
            placeholder="请输入"
            onChangeText={(v) => this.onChangeSearch(v)}
            value={searchQuery}
          />
          <Button
            onPress={() => {
              this.search();
            }}>
            搜索
          </Button>
        </View>
        <MusicList listAction={this.props.listAction} musicList={musicList} />
      </View>
    );
  }
}
