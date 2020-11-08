import React, {Component} from 'react';
import ArtistList from '../views/ArtistList';
import Hot from '../views/Hot';
import MusicList from '../views/MusicList';
import Search from '../views/Search';
import Setting from '../views/Setting';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Button, Drawer} from 'react-native-paper';

const Stack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

function HomePage(props) {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={() => {
          return (
            <Tab.Navigator
              tabBarOptions={{
                labelStyle: {fontSize: 12},
              }}
              initialRouteName={'Hot'}
              lazy={true}>
              <Tab.Screen name="Hot" component={Hot} />
              <Tab.Screen name="ArtistList" component={ArtistList} />
            </Tab.Navigator>
          );
        }}
      />
      <Drawer.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
}

export default class APPNavigator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{
              headerTitle: null,
              headerLeft: () => <Button>打开</Button>,
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
            component={HomePage}
          />
          <Stack.Screen name="MusicList" component={MusicList} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Setting" component={Setting} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
