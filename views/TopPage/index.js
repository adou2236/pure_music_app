import React, {Component} from 'react';
import MusicList from '../MusicList';
import {getHotList} from '../../http/api';

export default class TopPage extends Component {
  constructor(props) {
    console.log(props.route.params.name);
    super(props);
    this.state = {
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
          type: this.props.route.params.id,
        };
        getHotList(data).then((res) => {
          this.setState({
            listData: res.data.content,
            refreshing: false,
          });
        });
      },
    );
  };

  render() {
    const {listData} = this.state;
    const {currentPlaying} = this.props;
    return (
      <MusicList
        listAction={this.props.listAction}
        musicList={listData}
        currentPlaying={currentPlaying}
        mode={'net'}
      />
    );
  }
}
