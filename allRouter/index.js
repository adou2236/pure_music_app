import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import TopPage from '../views/TopPage';
import About from '../views/About';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {Animated, BackHandler} from 'react-native';
import {Button, IconButton, Searchbar, Text} from 'react-native-paper';
import ThemeSetting from '../views/Setting/ThemeSetting';

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
      console.log("隐藏主播放器")
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
    return (
      <>
        <NavigationContainer
          theme={theme}
          ref={(ref) => (this.navigation = ref)}>
          {/*  路由页*/}
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{
                title: '首页',
                headerShown: false,
              }}
              name="首页">
              {(props) => (
                <Home
                  {...props}
                  {...this.props}
                  backButton={() => this.hideModal()}
                />
              )}
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
                  theme={this.props.theme}
                  currentPlaying={this.props.currentPlaying}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              options={({navigation, route}) => ({
                title: '设置',
                headerStyle: {
                  backgroundColor: this.props.theme.colors.surface,
                },
                headerRight: () => (
                  <Button onPress={() => navigation.push('About')}>关于</Button>
                ),
              })}
              name="Setting">
              {(props) => <Setting {...props} theme={this.props.theme} />}
            </Stack.Screen>
            <Stack.Screen
              name="TopPage"
              options={({navigation, route}) => ({
                title: route.params.name,
                headerStyle: {
                  backgroundColor: this.props.theme.colors.surface,
                },
              })}>
              {(props) => (
                <TopPage
                  {...props}
                  theme={this.props.theme}
                  currentPlaying={this.props.currentPlaying}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              options={() => ({
                title: '关于',
                headerStyle: {
                  backgroundColor: this.props.theme.colors.surface,
                },
              })}
              name="About">
              {(props) => <About {...props} theme={this.props.theme} />}
            </Stack.Screen>
            <Stack.Screen
              options={() => ({
                title: '主体',
                headerStyle: {
                  backgroundColor: this.props.theme.colors.surface,
                },
              })}
              name="ThemeSetting">
              {(props) => <ThemeSetting {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
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
        </NavigationContainer>
      </>
    );
  }
}
