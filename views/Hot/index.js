import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {getRealUrl} from '../../unit/fn';

export default class Hot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fsuc: 'absolute',
    };
  }
  getUrl = () => {
    console.log('开始执行');
  };
  render() {
    const {navigation} = this.props;
    return (
      <View style={{height: 200}}>
        <Button onPress={() => navigation.navigate('Setting')}>跳转</Button>
        <Button onPress={() => this.getUrl()}>测试</Button>
      </View>
    );
  }
}
