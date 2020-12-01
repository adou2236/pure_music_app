import React, {Component} from 'react';
import Home from '../views/Home';
import Search from '../views/Search';
import Setting from '../views/Setting';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PlayerView from '../views/playerView';
import {BackHandler} from 'react-native';

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
              {(props) => (
                <Home
                  {...props}
                  {...this.props}
                />
              )}
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
                  currentPlaying={this.props.currentPlaying}
                  listAction={this.props.listAction}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Setting">
              {(props) => <Setting {...props} theme={this.props.theme} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
