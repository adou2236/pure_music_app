import React, {Component} from 'react';
import {View, DeviceEventEmitter, AsyncStorage} from 'react-native';
import {Text, DarkTheme, DefaultTheme, Switch} from 'react-native-paper';
import AllThemeColor from './AllTheme';
import {TouchableItem} from 'react-native-tab-view';
import {DoublyCircularLinkedList} from '../../unit/fn';

export default class ThemeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chengedTheme: props.theme,
    };
  }

  onToggleSwitch = (value) => {
    const {chengedTheme} = this.state;
    this.setState(
      {
        chengedTheme: value
          ? {
              ...DarkTheme,
              colors: {
                ...DarkTheme.colors,
                primary: chengedTheme.colors.primary,
              },
            }
          : {
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                primary: chengedTheme.colors.primary,
              },
            },
      },
      () => {
        DeviceEventEmitter.emit('theme_change', this.state.chengedTheme);
        this._storeData();
      },
    );
  };
  colorChange = (color) => {
    const {chengedTheme} = this.state;
    this.setState(
      {
        chengedTheme: {
          ...chengedTheme,
          colors: {...chengedTheme.colors, primary: color},
        },
      },
      () => {
        DeviceEventEmitter.emit('theme_change', this.state.chengedTheme);
        this._storeData();
      },
    );
  };

  //保存数据
  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'theme',
        JSON.stringify(this.state.chengedTheme),
      );
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    const {theme} = this.props;
    return (
      <View>
        <Text>颜色</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {AllThemeColor.map((item, index) => {
            return (
              <TouchableItem key={index} onPress={() => this.colorChange(item)}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: item,
                  }}>
                  <Text>{item}</Text>
                </View>
              </TouchableItem>
            );
          })}
        </View>
        <Text>夜间模式</Text>
        <Switch value={theme.dark} onValueChange={this.onToggleSwitch} />
      </View>
    );
  }
}
