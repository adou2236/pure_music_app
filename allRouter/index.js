import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import TopPage from '../views/TopPage';
import About from '../views/About';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {Animated, BackHandler, Platform} from 'react-native';
import {Button} from 'react-native-paper';
import ThemeSetting from '../views/Setting/ThemeSetting';
import Toast from 'react-native-easy-toast';
import CDrawer from 'react-native-drawer';

const Stack = createStackNavigator();
//const onBackPress = () => {
//         if (myProps.withBlur) {
//           console.log('先关闭窗口');
//           return true;
//         } else {
//           return false;
//         }
//       };
// BackHandler.addEventListener('hardwareBackPress', onBackPress());
// BackHandler.removeEventListener('hardwareBackPress', onBackPress());
//

// function MyApp(myProps) {
//   const PageListen = ({onUpdate}) => {
//     useFocusEffect(
//       React.useCallback(() => {
//         onUpdate();
//         return () => {
//           // Do something when the screen is unfocused
//         };
//       }, [onUpdate]),
//     );
//
//     return null;
//   };
//   useFocusEffect(
//     React.useCallback(() => {
//       console.log('获得聚焦');
//       return () => console.log('失去焦点');
//     }, []),
//   );
//   return (
//   );
// }

export default class APPNavigator extends Component {
  constructor(props) {
    super(props);
    this.player = null;
    this.state = {
      scaleAnimate: new Animated.Value(0),
      isOpen: false,
      isClose: true,
      withBlur: false,
      position: 'bottom',
    };
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
    console.log('隐藏主播放器');
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

  render() {
    const {playList, currentPlaying, theme} = this.props;
    const {scaleAnimate, withBlur, isOpen, isClose} = this.state;
    const PageListen = ({onUpdate}) => {
      useFocusEffect(
        React.useCallback(() => {
          console.log('聚焦');
          return () => {
            console.log('失去焦点');
          };
        }, []),
      );

      return null;
    };
    return (
      <>
        {/*<PageListen  withBlur={withBlur}/>*/}
        <NavigationContainer
          theme={theme}
          ref={(ref) => (this.navigation = ref)}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{
                title: '首页',
                headerShown: false,
              }}
              name="Home">
              {(props) => <Home {...props} {...this.props} />}
            </Stack.Screen>
            <Stack.Screen
              options={{
                title: '搜索',
                headerShown: false,
              }}
              name="Search">
              {(props) => (
                <Search
                  {...props}
                  theme={theme}
                  currentPlaying={currentPlaying}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              options={({navigation, route}) => ({
                title: '设置',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerRight: () => (
                  <Button onPress={() => navigation.push('About')}>关于</Button>
                ),
              })}
              name="Setting">
              {(props) => <Setting {...props} theme={theme} />}
            </Stack.Screen>
            <Stack.Screen
              name="TopPage"
              options={({navigation, route}) => ({
                title: route.params.name,
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
              })}>
              {(props) => (
                <TopPage
                  {...props}
                  theme={theme}
                  currentPlaying={currentPlaying}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              options={() => ({
                title: '关于',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
              })}
              name="About">
              {(props) => <About {...props} theme={theme} />}
            </Stack.Screen>
            <Stack.Screen
              options={() => ({
                title: '主体',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
              })}
              name="ThemeSetting">
              {(props) => <ThemeSetting {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
        {/*  底部播放器*/}
        {/*props中包含theme={theme}playList={playList}currentPlaying={currentPlaying}*/}
        {playList.size() > 0 && currentPlaying ? (
          <PlayerView
            ref={(ref) => {
              this.player = ref;
            }}
            navigation={this.navigation}
            {...this.props}
            scaleAnimate={scaleAnimate}
            withBlur={withBlur}
            isOpen={isOpen}
            isClose={isClose}
            preSong={() => this.props.preSong()}
            nextSong={(number = 1) => this.props.nextSong(number)}
            destroyLinklist={() => this.props.destroyLinklist()}
            listAction={(op, data) => this.props.listAction(op, data)}
            showModal={this.showModal}
            hideModal={this.hideModal}
          />
        ) : null}
        <Toast ref="toast" position={this.state.position} />
      </>
    );
  }
}
