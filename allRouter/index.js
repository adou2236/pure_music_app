import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import TopPage from '../views/TopPage';
import About from '../views/About';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {BackHandler} from 'react-native';
import {Button, IconButton, Searchbar} from 'react-native-paper';
import HotPage from '../views/TopPage';
import ThemeSetting from '../views/Setting/ThemeSetting';

const Stack = createStackNavigator();

export default class APPNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    return (
      <>
        <NavigationContainer theme={this.props.theme}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{
                title: '首页',
                headerShown: false,
              }}
              name="首页">
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
                  <Button onPress={() => console.log(navigation.push('About'))}>
                    关于
                  </Button>
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
        </NavigationContainer>
      </>
    );
  }
}
