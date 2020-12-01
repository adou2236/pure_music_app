import React, {Component} from 'react';
import {IconButton, List, Menu} from 'react-native-paper';

export default class listObj extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openMenu = () => {
    this.setState({
      visible: true,
    });
  };
  closeMenu = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {visible} = this.state;
    const {item, mode, isPlaying} = this.props;
    return (
      <List.Item
        title={item.song_name}
        description={item.author}
        onPress={() => this.props.selectMusic(item)}
        left={() =>
          isPlaying ? (
            <List.Icon
              style={{margin: 0, marginVertical: 'auto'}}
              icon="play-outline"
            />
          ) : null
        }
        right={(props) =>
          mode === 'local' ? (
            <IconButton
              {...props}
              onPress={() => this.props.removeMusic(item)}
              icon="delete-outline"
            />
          ) : (
            <Menu
              visible={visible}
              onDismiss={this.closeMenu}
              anchor={
                <IconButton
                  {...props}
                  onPress={this.openMenu}
                  icon="dots-vertical"
                />
              }>
              <Menu.Item
                onPress={() => {
                  this.props.addToList(item, 'addEnd');
                  this.closeMenu();
                }}
                title="加入播放列表"
              />
              <Menu.Item
                onPress={() => {
                  this.props.addToList(item, 'addNext');
                  this.closeMenu();
                }}
                title="下一曲播放"
              />
            </Menu>
          )
        }
      />
    );
  }
}
