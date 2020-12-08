import React, {Component} from 'react';
import MusicList from '../MusicList';
import {getHotList} from '../../http/api';
import {throttle} from '../../unit/fn';

export default class TopPage extends Component {
  constructor(props) {
    super(props);
    console.log('获取到的参数-----------', props);
    this.endReach = throttle(this.endReach, 300);
    this.state = {
      listData: [],
      currentPage: 1,
      pageSize: 50,
      carryOnLoading: true,
      refreshing: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.route.params !== prevProps.route.params) {
      console.log(this.props.route.params);
      this.refesh();
    }
  }
  componentDidMount() {
    this.getHotList();
  }
  getHotList = (page = 1) => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        let data = {
          type: this.props.route.params.id,
        };
        if (this.props.route.params.author) {
          data = {
            ...data,
            author: this.props.route.params.author,
            pageSize: this.state.pageSize,
            currentPage: page,
          };
        }
        getHotList(data).then((res) => {
          if (res.length !== 0) {
            this.setState({
              refreshing: false,
              listData: this.state.listData.concat(res.data.content),
            });
            if (
              this.props.route.params.id ||
              this.state.currentPage * this.state.pageSize >=
                res.data.pageInfo.total
            ) {
              this.setState({
                carryOnLoading: false,
              });
            }
          }
        });
      },
    );
  };

  refesh = () => {
    this.setState(
      {
        refreshing: 'up',
        listData: [],
        carryOnLoading: true,
        currentPage: 1,
      },
      () => {
        this.getHotList(1);
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
        this.getHotList(this.state.currentPage);
      },
    );
  };

  render() {
    const {listData, carryOnLoading} = this.state;
    const {currentPlaying} = this.props;
    return (
      <MusicList
        listAction={this.props.listAction}
        musicList={listData}
        currentPlaying={currentPlaying}
        mode={'net'}
        loadAction={carryOnLoading}
        refreshing={this.state.refreshing}
        refresh={this.refesh}
        endReach={
          this.props.route.params.author
            ? this.endReach
            : () => {
                return;
              }
        }
      />
    );
  }
}
