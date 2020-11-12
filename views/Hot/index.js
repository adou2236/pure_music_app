import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';

export default class Hot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fsuc: 'absolute',
    }
  }
  render() {
    const {navigation} = this.props;
    return (
      <View style={{backgroundColor:'red',height:200}}>
        <Button onPress={() => navigation.navigate('MusicList')}>跳转</Button>
      </View>
    );
  }
}
