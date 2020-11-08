/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  NativeModules,
} from 'react-native';
import APPNavigator from './allRouter';
const {StatusBarManager} = NativeModules;

let statusBarHeight;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((height) => {
    statusBarHeight = height;
  });
} else {
  statusBarHeight = StatusBar.currentHeight;
}

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView style={[styles.container, {marginTop: statusBarHeight}]}>
        <APPNavigator />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default App;
