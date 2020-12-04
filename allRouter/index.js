import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import TopPage from '../views/TopPage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {BackHandler} from 'react-native';
import {IconButton, Searchbar} from 'react-native-paper';
import HotPage from '../views/TopPage';

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
              options={{
                title: '设置',
                headerShown: false,
              }}
              name="Setting">
              {(props) => <Setting {...props} theme={this.props.theme} />}
            </Stack.Screen>
            <Stack.Screen
              name="TopPage"
              options={({navigation, route}) => ({
                title: route.params.name,
                headerStyle: {
                  backgroundColor: this.props.theme.colors.surface,
                  borderBottomWidth: 0,
                  elevation: 0,
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
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
