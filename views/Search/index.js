import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Searchbar, IconButton, Button} from 'react-native-paper';
import MusicList from '../MusicList';
import {getAllMusic} from '../../http/api';
import {debounce, throttle} from '../../unit/fn';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.endReach = throttle(this.endReach, 300);
    this.state = {
      searchQuery: '',
      musicList: [],
      pageSize: 50,
      currentPage: 1,
      refreshing: false,
      carryOnLoading: true,
    };
  }

  onChangeSearch = (v) => {
    this.setState({
      searchQuery: v,
    });
  };

  getData = (currentPage) => {
    let params = {
      pageSize: this.state.pageSize,
      currentPage: currentPage,
      keywords: this.state.searchQuery,
    };
    getAllMusic(params).then((res) => {
      console.log('搜索结果为', res);
      if (res.length !== 0) {
        this.setState({
          refreshing: false,
          musicList: this.state.musicList.concat(res.data.content),
        });
        if (currentPage * this.state.pageSize >= res.data.pageInfo.total) {
          this.setState({
            carryOnLoading: false,
          });
        }
      }
    });
  };

  search = (currentPage = 1) => {
    this.setState(
      {
        refreshing: 'up',
        musicList: [],
        carryOnLoading: true,
        currentPage: 1,
      },
      () => {
        this.getData(1);
      },
    );
  };

  refesh = () => {
    this.setState(
      {
        refreshing: 'up',
        musicList: [],
        carryOnLoading: true,
        currentPage: 1,
      },
      () => {
        this.getData(1);
      },
    );
  };

  endReach = () => {
    this.setState(
      {
        refreshing: 'bottom',
        currentPage: this.state.currentPage + 1,
      },
      () => {
        this.getData(this.state.currentPage);
      },
    );
  };

  render() {
    const {searchQuery, musicList, carryOnLoading} = this.state;
    const {navigation, currentPlaying} = this.props;
    return (
      <View style={{height: '100%'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            backgroundColor: this.props.theme.colors.surface,
          }}>
          <Searchbar
            icon={'arrow-left'}
            onIconPress={() => navigation.pop()}
            style={{
              width: '80%',
              borderRadius: 10,
              elevation: 0,
            }}
            onSubmitEditing={() => {
              this.search();
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
        <MusicList
          refreshing={this.state.refreshing}
          refresh={this.refesh}
          endReach={this.endReach}
          listAction={this.props.listAction}
          musicList={musicList}
          currentPlaying={currentPlaying}
          mode={'net'}
          loadAction={carryOnLoading}
        />
      </View>
    );
  }
}
