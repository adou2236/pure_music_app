import React, {Component} from 'react';
import {AsyncStorage, View} from 'react-native';
import {Text, Searchbar, IconButton, Button, Chip} from 'react-native-paper';
import MusicList from '../MusicList';
import {getAllMusic} from '../../http/api';
import {throttle} from '../../unit/fn';
import {playerStyle} from '../../style/style';
import {useFocusEffect} from '@react-navigation/native';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.endReach = throttle(this.endReach, 300);
    this.state = {
      searchQuery: '',
      searchKey: '',
      musicList: [],
      pageSize: 50,
      currentPage: 1,
      refreshing: false,
      carryOnLoading: true,
      showHistory: true,
      searchHistory: [],
    };
  }

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const searchHistory = await AsyncStorage.getItem('searchHistory');
      if (searchHistory !== null) {
        this.setState({
          searchHistory: searchHistory.split(','),
        });
      }
    } catch (error) {
      this.setState({
        searchHistory: [],
      });
      // Error retrieving data
    }
  };

  removeAllHistory = () => {
    this.setState(
      {
        searchHistory: [],
      },
      () => this._storeData(),
    );
  };

  removeHistory = (item) => {
    this.state.searchHistory.splice(this.state.searchHistory.indexOf(item), 1);
    this.setState(
      {
        searchHistory: this.state.searchHistory,
      },
      () => this._storeData(),
    );
  };

  //保存数据
  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'searchHistory',
        this.state.searchHistory.toString(),
      );
    } catch (error) {
      // Error saving data
    }
  };

  onChangeSearch = (v) => {
    this.setState({
      searchQuery: v,
    });
  };

  getData = (currentPage) => {
    let params = {
      pageSize: this.state.pageSize,
      currentPage: currentPage,
      keywords: this.state.searchKey,
    };
    getAllMusic(params).then((res) => {
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
    if (this.state.searchQuery) {
      if (this.state.searchHistory.indexOf(this.state.searchQuery) === -1) {
        this.state.searchHistory.push(this.state.searchQuery);
        this.setState(
          {
            searchHistory: this.state.searchHistory,
          },
          () => this._storeData(),
        );
      }
      this.setState(
        {
          searchKey: this.state.searchQuery,
          refreshing: 'up',
          musicList: [],
          carryOnLoading: true,
          currentPage: 1,
          showHistory: false,
        },
        () => {
          this.getData(1);
        },
      );
    }
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
    const {
      searchQuery,
      musicList,
      carryOnLoading,
      showHistory,
      searchHistory,
    } = this.state;
    const {navigation, currentPlaying} = this.props;
    const HistoryComponent = () => (
      <View>
        <View style={playerStyle.headLine}>
          <Text style={{fontSize: 15}}>搜索历史</Text>
          <IconButton
            icon="delete-outline"
            onPress={() => {
              this.removeAllHistory();
            }}
          />
        </View>
        <View
          style={{
            dispaly: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 10,
          }}>
          {searchHistory.map((item, index) => {
            return (
              <Chip
                key={index}
                style={{marginRight: 10, marginBottom: 10}}
                onClose={() => {
                  this.removeHistory(item);
                }}
                onPress={() => {
                  this.setState({searchQuery: item}, () => this.search());
                }}>
                {item}
              </Chip>
            );
          })}
        </View>
      </View>
    );


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
              elevation: 0,
              overFlow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
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
        {showHistory && searchHistory.length !== 0 ? (
          <HistoryComponent />
        ) : (
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
        )}
      </View>
    );
  }
}
