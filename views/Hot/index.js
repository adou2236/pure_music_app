import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';

export default class Hot extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Button onPress={() => navigation.navigate('Setting')}>跳转</Button>
      </View>
    );
  }
}
