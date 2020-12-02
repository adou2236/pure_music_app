/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  NativeModules,
  BackHandler,
  Animated,
} from 'react-native';
import APPNavigator from './allRouter';
const {StatusBarManager} = NativeModules;
import {
  Button,
  Colors,
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import PlayerView from './views/playerView';
import {AsyncStorage} from 'react-native';
import {DoublyCircularLinkedList} from './unit/fn'; //本地存储模块

let statusBarHeight;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((height) => {
    statusBarHeight = height;
  });
} else {
  statusBarHeight = StatusBar.currentHeight;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: new DoublyCircularLinkedList(),
      currentPlaying: null,
      isOpen: false,
      isClose: true,
      withBlur: false,
      scaleAnimate: new Animated.Value(0),
    };
  }
  componentDidMount() {
    //歌曲列表，循环双链表结构，存在本地只能以字符串形式，存与去需要进行格式化
    this._retrieveData();
  }

  showModal = () => {
    Animated.spring(this.state.scaleAnimate, {
      toValue: 1,
      velocity: 2, //初始速度
      friction: 8, //摩擦力值
      duration: 1500, //
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isClose: false,
      });
    });
    this.setState({
      withBlur: true,
      isOpen: true,
    });
  };

  hideModal = () => {
    Animated.spring(this.state.scaleAnimate, {
      toValue: 0,
      velocity: 2, //初始速度
      friction: 8, //摩擦力值
      duration: 1500, //
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isOpen: false,
      });
      //延迟执行
    });
    //立即执行
    this.setState({
      withBlur: false,
      isClose: true,
    });
  };

  //从存储中读取
  _retrieveData = async () => {
    try {
      const playList = await AsyncStorage.getItem('playList');
      const currentPlaying = await AsyncStorage.getItem('currentPlaying');
      if (playList !== null) {
        JSON.parse(playList).forEach((item) => {
          this.state.playList.append(item);
        });
        this.setState({
          playList: this.state.playList,
        });
      }
      if (currentPlaying !== null) {
        var temp = this.state.playList.reLocate(JSON.parse(currentPlaying));
        this.setState({
          currentPlaying: temp === -1 ? this.state.playList.getHead() : temp,
        });
      }
    } catch (error) {
      this.setState({
        playList: new DoublyCircularLinkedList(),
        currentPlaying: null,
      });
      // Error retrieving data
    }
  };

  //保存数据
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('playList', this.state.playList.toString());
      await AsyncStorage.setItem(
        'currentPlaying',
        JSON.stringify(this.state.currentPlaying.element),
      );
    } catch (error) {
      // Error saving data
    }
  };

  text = () => {
    this._retrieveData();
  };

  destroyLinklist = () => {
    this.state.playList.destroy();
    this.setState(
      {
        playList: this.state.playList,
        currentPlaying: null,
      },
      () => {
        this._storeData();
      },
    );
  };

  listAction = (op, data) => {
    switch (op) {
      //移除
      case 'remove':
        this.state.playList.remove(data);
        if (data === this.state.currentPlaying.element) {
          if (this.state.playList.size() === 0) {
            this.state.currentPlaying = null;
          } else {
            this.state.currentPlaying = this.state.currentPlaying.next;
          }
        }
        this.setState(
          {
            currentPlaying: this.state.currentPlaying,
            playList: this.state.playList,
          },
          () => this._storeData(),
        );
        return;
      //选择
      case 'select':
        var result = this.state.playList.reLocate(data);
        if (result === -1) {
          this.state.playList.append(data);
          this.state.currentPlaying = this.state.playList.reLocate(data);
          this.setState(
            {
              playList: this.state.playList,
              currentPlaying: this.state.currentPlaying,
            },
            () => this._storeData(),
          );
        } else {
          this.setState({currentPlaying: result}, () => {
            this._storeData();
          });
        }

        return;
      //加入（下一曲）
      case 'addNext':
        let index = this.state.playList.indexOf(
          this.state.currentPlaying.element,
        );
        if (this.state.playList.indexOf(data) === -1) {
          this.state.playList.insert(index, data);
        }
        if (this.state.currentPlaying === null) {
          this.state.currentPlaying = this.state.playList.getHead();
        }
        this.setState(
          {
            playList: this.state.playList,
            currentPlaying: this.state.currentPlaying,
          },
          () => this._storeData(),
        );
        return;
      //加入（队尾）
      case 'addEnd':
        this.state.playList.append(data);
        if (this.state.currentPlaying === null) {
          this.state.currentPlaying = this.state.playList.getHead();
        }
        this.setState(
          {
            playList: this.state.playList,
            currentPlaying: this.state.currentPlaying,
          },
          () => this._storeData(),
        );
        return;
      default:
        return;
    }
  };
  render() {
    const {playList, currentPlaying, isClose, isOpen, withBlur} = this.state;
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        height: '100%',
        flex: 1,
      },
      Main: {
        display: 'flex',
      },
      fakeBox: {
        height: 53,
      },
    });
    const theme = {
      ...DefaultTheme,
      roundness: 2,
      colors: {
        ...DefaultTheme.colors,
        primary: '#ff00a1',
      },
    };

    return (
      <SafeAreaView
        style={[styles.container]}
        backgroundColor={theme.colors.surface}>
        <PaperProvider style={styles.Main} theme={theme}>
          <StatusBar
            animated={true}
            barStyle={theme.dark ? 'light-content' : 'dark-content'} // enum('default', 'light-content', 'dark-content')
          />
          <APPNavigator
            theme={theme}
            style={{flex: 1}}
            currentPlaying={currentPlaying}
            withBlur={withBlur}
            listAction={(op, data) => this.listAction(op, data)}
            backButton={() => this.hideModal()}
          />
          {/*此处为绝对定位*/}
          {playList.size() > 0 && currentPlaying ? (
            <PlayerView
              theme={theme}
              scaleAnimate={this.state.scaleAnimate}
              withBlur={withBlur}
              isOpen={isOpen}
              isClose={isClose}
              playList={playList}
              currentPlaying={currentPlaying}
              preSong={() =>
                this.setState(
                  {
                    currentPlaying: this.state.currentPlaying.prev,
                  },
                  () => {
                    this._storeData();
                  },
                )
              }
              nextSong={(number = 1) => {
                while (number-- > 0) {
                  this.state.currentPlaying = this.state.currentPlaying.next;
                }
                this.setState(
                  {
                    currentPlaying: this.state.currentPlaying,
                  },
                  () => {
                    this._storeData();
                  },
                );
              }}
              destroyLinklist={() => this.destroyLinklist()}
              listAction={(op, data) => this.listAction(op, data)}
              showModal={this.showModal}
              hideModal={this.hideModal}
            />
          ) : null}
        </PaperProvider>
      </SafeAreaView>
    );
  }
}

export default App;
