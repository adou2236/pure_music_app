import React, {Component} from 'react';
import {IconButton, List, Menu} from 'react-native-paper';
import {playerStyle} from '../../style/style';
import {Animated} from 'react-native';

export default class listObj extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      scaleAnimate: props.withAnimation
        ? new Animated.Value(0)
        : new Animated.Value(1),
    };
  }

  componentDidMount() {
    if (this.props.withAnimation) {
      const {index} = this.props;
      const delay = index * 100;
      Animated.spring(this.state.scaleAnimate, {
        toValue: 1,
        velocity: 2, //初始速度
        friction: 8, //摩擦力值
        duration: 1500,
        useNativeDriver: true,
        delay: delay,
      }).start();
    }
  }

  componentWillUnmount() {
    //卸载动画需要先执行动画在回调清空数据
    // const {index} = this.props;
    // const delay = index * 100;
    // console.log('组件卸载', delay);
    // Animated.timing(
    //   // 随时间变化而执行动画
    //   this.state.fadeAnim, // 动画中的变量值
    //   {
    //     useNativeDriver: true,
    //     toValue: 0, // 透明度最终变为1，即完全不透明
    //     duration: 1000, // 让动画持续一段时间
    //   },
    // ).start();
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
      <Animated.View
        style={{
          transform: [
            {
              //偏移效果
              translateX: this.state.scaleAnimate.interpolate({
                inputRange: [0, 1],
                outputRange: [1000, 0],
              }),
            },
          ],
        }}>
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
      </Animated.View>
    );
  }
}
