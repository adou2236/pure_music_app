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
import {
  Colors,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import PlayerView from './views/playerView';

let statusBarHeight;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((height) => {
    statusBarHeight = height;
  });
} else {
  statusBarHeight = StatusBar.currentHeight;
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.blue200,
    accent: '#f1c40f',
  },
};

const App: () => React$Node = () => {
  return (
    <>
      <SafeAreaView style={[styles.container]}>
        <PaperProvider theme={theme}>
          <APPNavigator />
          <PlayerView />
        </PaperProvider>
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
