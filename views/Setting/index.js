import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, IconButton, Searchbar, Text} from 'react-native-paper';

export default class Setting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Text>设置</Text>
      </View>
    );
  }
}
