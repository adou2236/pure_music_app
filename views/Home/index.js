import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import Hot from '../Hot';
import ArtistList from '../ArtistList';
import CDrawer from 'react-native-drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Drawer} from 'react-native-paper';

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
                      marginHorizontal: 8,
                      borderBottomWidth: 2,
                      borderColor: props.theme.colors.primary,
                    }
                  : {marginHorizontal: 8}
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
        onPress={() => props.navigation.navigate('Search')}>
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

  sideMenuPush = (router) => {
    this.setState({isOpen: false});
    this.props.navigation.navigate(router);
  };

  render() {
    return (
      <CDrawer
        styles={{
          drawer: {
            backgroundColor: this.props.theme.colors.surface,
          },
        }}
        type={'overlay'}
        tapToClose={true}
        openDrawerOffset={100}
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        tweenHandler={(ratio) => ({
          main: {opacity: (2 - ratio) / 2},
        })}
        captureGestures={true}
        onOpen={() => {
          this.setState({
            isOpen: true,
          });
        }}
        onClose={() => {
          this.setState({
            isOpen: false,
          });
        }}
        open={this.state.isOpen}
        content={
          <>
            <Drawer.Section>
              <Drawer.Item label="首页" />
              <Drawer.Item
                label="搜索"
                onPress={() => this.sideMenuPush('Search')}
              />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item
                label="设置"
                onPress={() => this.sideMenuPush('Setting')}
              />
            </Drawer.Section>
          </>
        }>
        <Tab.Navigator
          lazy={true}
          tabBar={(props) => (
            <MyTabBar
              theme={this.props.theme}
              openSide={this.openSide}
              {...props}
            />
          )}>
          <Tab.Screen name="排行">
            {(props) => <Hot {...props} {...this.props} />}
          </Tab.Screen>
          <Tab.Screen name="歌手">
            {() => <ArtistList navigation={this.props.navigation} />}
          </Tab.Screen>
        </Tab.Navigator>
      </CDrawer>
    );
  }
}
