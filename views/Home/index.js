import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import Hot from '../Hot';
import ArtistList from '../ArtistList';
import SideMenu from 'react-native-side-menu';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors, Drawer, Switch} from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

function MyTabBar(props) {
  const {state, descriptors, navigation} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: props.theme.colors.surface,
      }}>
      <IconButton
        icon="menu"
        color={props.theme.colors.text}
        size={25}
        onPress={() => props.openSide()}>
        菜单
      </IconButton>
      <View
        style={{
          width: '20%',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
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
          const homeStyle = StyleSheet.create({
            Tab: {
              fontSize: 14,
              color: props.theme.colors.placeholder,
              borderRadius: 0,
            },
            activeTab: {
              borderRadius: 0,
              fontSize: 18,
              color: props.theme.colors.text,
            },
          });

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              style={
                isFocused
                  ? {
                      borderBottomWidth: 2,
                      borderColor: props.theme.colors.primary,
                    }
                  : ''
              }
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}>
              <Text style={isFocused ? homeStyle.activeTab : homeStyle.Tab}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <IconButton
        icon="magnify"
        color={props.theme.colors.text}
        size={25}
        onPress={() => navigation.navigate('Search')}>
        搜索
      </IconButton>
    </View>
  );
}

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      nightMode: false,
      active: '',
    };
  }
  openSide = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  changeNightMode = (v) => {
    console.log(v);
    this.setState({
      nightMode: v,
    });
  };
  componentDidMount() {}
  render() {
    const {nightMode, active} = this.state;
    return (
      <SideMenu
        onChange={(v) => {
          this.setState({
            isOpen: v,
          });
        }}
        isOpen={this.state.isOpen}
        menu={
          <>
            <Drawer.Section>
              <Drawer.Item label="首页" active={active === 'Home'} />
              <Drawer.Item label="搜索" active={active === 'Search'} />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item label="设置" active={active === 'Setting'} />
            </Drawer.Section>
            {/*<Drawer.Section>*/}
            {/*    <Drawer.Item*/}
            {/*        label="设置"*/}
            {/*        active={active === 'Setting'}*/}
            {/*    />*/}
            {/*    <Switch value={nightMode} onValueChange={this.changeNightMode} />*/}

            {/*</Drawer.Section>*/}
          </>
        }>
        <Tab.Navigator
          tabBar={(props) => (
            <MyTabBar
              theme={this.props.theme}
              openSide={this.openSide}
              {...props}
            />
          )}>
          <Tab.Screen name="热门" component={Hot} />
          <Tab.Screen name="最新" component={ArtistList} />
        </Tab.Navigator>
      </SideMenu>
    );
  }
}
