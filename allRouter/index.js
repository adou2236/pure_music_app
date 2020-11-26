import React, {Component} from 'react';
import Home from '../views/Home';
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
                headerShown: false,
              }}
              name="Home">
              {(props) => <Home {...props} theme={this.props.theme} />}
            </Stack.Screen>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Search">
              {(props) => (
                <Search
                  {...props}
                  theme={this.props.theme}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Setting" component={Setting} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
