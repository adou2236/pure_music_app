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
  DeviceEventEmitter,
} from 'react-native';
import APPNavigator from './allRouter';
const {StatusBarManager} = NativeModules;
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {AsyncStorage} from 'react-native';
import {DoublyCircularLinkedList} from './unit/fn';
import AllThemeColor from './views/Setting/AllTheme'; //本地存储模块

let statusBarHeight;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((height) => {
    statusBarHeight = height;
  });
} else {
  statusBarHeight = StatusBar.currentHeight;
}

const defalutTheme = {
  ...DefaultTheme,
  colors: {...DefaultTheme.colors, primary: AllThemeColor[0]},
};
class App extends Component {
  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      playList: new DoublyCircularLinkedList(),
      currentPlaying: null,
      isOpen: false,
      isClose: true,
      withBlur: false,
      theme: defalutTheme,
    };
  }
  componentDidMount() {
    //歌曲列表，循环双链表结构，存在本地只能以字符串形式，存与去需要进行格式化
    this._retrieveData();
    DeviceEventEmitter.addListener('theme_change', (params) => {
      this.setState({
        theme: params,
      });
    });
  }

  //从存储中读取
  _retrieveData = async () => {
    try {
      const playList = await AsyncStorage.getItem('playList');
      const currentPlaying = await AsyncStorage.getItem('currentPlaying');
      const theme = await AsyncStorage.getItem('theme');
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
      if (theme !== null) {
        this.setState({
          theme: JSON.parse(theme),
        });
      } else {
        this.setState({
          playList: new DoublyCircularLinkedList(),
          currentPlaying: null,
          theme: defalutTheme,
        });
      }
    } catch (error) {
      this.setState({
        playList: new DoublyCircularLinkedList(),
        currentPlaying: null,
        theme: defalutTheme,
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
            () => {
              //选择后立刻播放
              this.player.player.pauseControl(true);
              this._storeData();
            },
          );
        } else {
          this.setState({currentPlaying: result}, () => {
            //选择后立刻播放
            console.log(this.player);
            this.player.player.pauseControl(true);
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
    const {playList, currentPlaying, theme} = this.state;
    console.log('主题', theme);
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
            ref={(ref) => {
              this.player = ref;
            }}
            theme={theme}
            playList={playList}
            currentPlaying={currentPlaying}
            listAction={(op, data) => this.listAction(op, data)}
            preSong={() => {
              this.setState(
                {
                  currentPlaying: this.state.currentPlaying.prev,
                },
                () => {
                  this._storeData();
                },
              );
            }}
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
          />
        </PaperProvider>
      </SafeAreaView>
    );
  }
}

export default App;
