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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            backgroundColor: this.props.theme.colors.surface,
          }}>
          <IconButton
            icon={'arrow-left'}
            onIconPress={() => navigation.pop()}
          />
          <Button
            onPress={() => {
              this.search();
            }}>
            关于
          </Button>
        </View>
      </View>
    );
  }
}
