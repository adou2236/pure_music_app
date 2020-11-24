import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import Hot from '../Hot';
import ArtistList from '../ArtistList';
import SideMenu from 'react-native-side-menu';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function MyTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  componentDidMount() {}
  render() {
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
            <Text
              style={{marginTop: 0}}
              onPress={() => window.open('/MusicList')}>
              aaa
            </Text>
          } //抽屉内的组件
        >
          <Tab.Navigator
            tabBarOptions={{
              style: {
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
              },
              labelStyle: {
                width: '50%',
                justifyContent: 'center',
                fontSize: 12,
              },
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
}
