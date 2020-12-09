import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import TopPage from '../views/TopPage';
import About from '../views/About';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {Animated, BackHandler} from 'react-native';
import {Button} from 'react-native-paper';
import ThemeSetting from '../views/Setting/ThemeSetting';
import Toast from 'react-native-easy-toast';

const Stack = createStackNavigator();

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
    const onBackPress = (data) => {
      if (this.state.withBlur) {
        this.hideModal();
        return true;
      } else if (data.route.name === 'Home') {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          //最近2秒内按过back键，可以退出应用。
          BackHandler.exitApp();
          return;
        }
        this.lastBackPressed = Date.now();
        this.refs.toast.show('再按一次退出', 300);
        return true;
      } else {
        data.navigation.pop();
        return true;
      }
    };
    const PageListen = (data) => {
      useFocusEffect(
        React.useCallback(() => {
          BackHandler.addEventListener('hardwareBackPress', () =>
            onBackPress(data),
          );
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', () =>
              onBackPress(data),
            );
          };
        }, [data]),
      );

      return null;
    };
    return (
      <>
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
              {(props) => (
                <>
                  <PageListen {...props} />
                  <Home {...props} {...this.props} />
                </>
              )}
            </Stack.Screen>
            <Stack.Screen
              options={{
                title: '搜索',
                headerShown: false,
              }}
              name="Search">
              {(props) => (
                <>
                  <PageListen {...props} />
                  <Search
                    {...props}
                    theme={theme}
                    currentPlaying={currentPlaying}
                    listAction={this.props.listAction}
                  />
                </>
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
              {(props) => (
                <>
                  <PageListen {...props} />
                  <Setting {...props} theme={theme} />
                </>
              )}
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
                <>
                  <PageListen {...props} />
                  <TopPage
                    {...props}
                    theme={theme}
                    currentPlaying={currentPlaying}
                    listAction={this.props.listAction}
                  />
                </>
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
              {(props) => (
                <>
                  <PageListen {...props} />
                  <About {...props} theme={theme} />
                </>
              )}
            </Stack.Screen>
            <Stack.Screen
              options={() => ({
                title: '主体',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
              })}
              name="ThemeSetting">
              {(props) => (
                <>
                  {' '}
                  <PageListen {...props} />
                  <ThemeSetting {...props} />
                </>
              )}
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
