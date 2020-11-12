import React, {Component} from 'react';
import ArtistList from '../views/ArtistList';
import Hot from '../views/Hot';
import MusicList from '../views/MusicList';
import Search from '../views/Search';
import Setting from '../views/Setting';
import PlayerView from '../views/playerView';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Button, Drawer, Provider as PaperProvider} from 'react-native-paper';
import {Text, View} from 'react-native';
import SideMenu from 'react-native-side-menu';

const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

export default class APPNavigator extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }

  HomePage() {
    return (
      <>
        <SideMenu
          onChange={(v) => {
            this.setState({
              isOpen: v,
            });
          }}
          isOpen={this.state.isOpen}
          menu={
            <Text style={{marginTop: 0}} onPress={() => alert('点击了aaa')}>
              aaa
            </Text>
          } //抽屉内的组件
        >
          <Tab.Navigator
            tabBarOptions={{
              labelStyle: {fontSize: 12},
            }}
            initialRouteName={'Hot'}
            lazy={true}>
            <Tab.Screen name="Hot" component={Hot} />
            <Tab.Screen name="ArtistList" component={ArtistList} />
          </Tab.Navigator>
        </SideMenu>
      </>
    );
  }
  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{
                headerTitle: null,
                headerLeft: () => (
                  <Button
                    onPress={() => {
                      this.setState({
                        isOpen: !this.state.isOpen,
                      });
                    }}>
                    打开
                  </Button>
                ),
                headerRight: (e) => (
                  <Button
                    onPress={(a) => console.log(this)}
                    title="Info"
                    color="#00cc00">
                    搜索
                  </Button>
                ),
              }}
              name="Home"
              component={this.HomePage.bind(this)}
            />
            <Stack.Screen name="MusicList" component={MusicList} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Setting" component={Setting} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
