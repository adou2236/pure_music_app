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
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  NativeModules,
} from 'react-native';
import APPNavigator from './allRouter';
const {StatusBarManager} = NativeModules;
import {
  Colors,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import PlayerView from './views/playerView';
import {AsyncStorage} from 'react-native'; //本地存储模块
import {block} from 'react-native-reanimated';

let statusBarHeight;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((height) => {
    statusBarHeight = height;
  });
} else {
  statusBarHeight = StatusBar.currentHeight;
}

// const playList = [
//   {
//     uri:
//       'https://hifini.com/get_music.php?key=q9Frj3NC24X65iSMjd7LOw/wt5BnROmq6l1WWdAQvtcGTmCs8q2IUnvVt4+xXwpnmw4qTmLTnQ',
//     artist: '林俊杰',
//     name: '心墙',
//     cover:
//       'https://y.gtimg.cn/music/photo_new/T002R300x300M000000TuW8h0AH2n4.jpg',
//   },
//   {
//     uri:
//       'https://hifini.com/get_music.php?key=rtY933VE2db65iSMjd7LOw/wt5BnROmq6l1WWdAQvtcGTmCs8q2MKlrEkPC2ZH5svxYqTmLTnQ+2b1EV/eIXNQ',
//     artist: '林俊杰',
//     name: '像我这样的人',
//     cover:
//       'https://y.gtimg.cn/music/photo_new/T002R300x300M000001iSEF22IqiYB.jpg',
//   },
//   {
//     uri:
//       'https://hifini.com/get_music.php?key=pIdgjSYSidf65iSMjd7LOw/wt5BnROmq6l1WWdAQvtcGTmCs8q2IKX3Qn9GxSQgOn1MqTmLTnQ+ybFUX9+c',
//     artist: '周杰伦',
//     name: '暗号',
//     cover:
//       'https://y.gtimg.cn/music/photo_new/T002R300x300M000004MGitN0zEHpb.jpg',
//   },
// ];

// AsyncStorage.setItem('playList', JSON.stringify(playList), (error) => {
//   if (error) {
//     console.log('存储失败');
//   } else {
//     console.log('存储成功');
//   }
// });

// const App: () => React$Node = () => {
//   let playList = [];
//   AsyncStorage.getItem('playList', (error, result) => {
//     if (!error) {
//       const res = JSON.parse(result);
//       console.log('AsyncStorage******************', res);
//       playList = res;
//     }
//   });
//   return (
//     <>
//
//     </>
//   );
// };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: [],
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('playList', (error, result) => {
      if (!error) {
        const res = JSON.parse(result);
        console.log('AsyncStorage******************', res);
        this.setState({
          playList: res,
        });
      }
    });
  }
  render() {
    console.log('测试一下', AsyncStorage.getItem('playList'));
    const {playList} = this.state;
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
        primary: Colors.blue200,
        accent: '#f1c40f',
      },
    };

    return (
      <SafeAreaView style={[styles.container]}>
        <PaperProvider style={styles.Main} theme={theme}>
          <APPNavigator style={{flex: 1}} />
          {/*此处为绝对定位*/}
          {playList.length > 0 ? <PlayerView playList={playList} /> : null}
        </PaperProvider>
      </SafeAreaView>
    );
  }
}

export default App;
