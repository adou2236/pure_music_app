import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
  Linking,
  FlatList,
} from 'react-native';
import {Text, ProgressBar, Dialog, Title} from 'react-native-paper';
import _updateConfig from '../../update.json';
import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
  downloadAndInstallApk,
} from 'react-native-update';
const {appKey} = _updateConfig[Platform.OS];

export default class About extends Component {
  constructor() {
    super();
    this.state = {
      received: 0,
      total: 1,
      visible: false,
      DATA: [
        {
          title: 'RNapp、服务端开发',
          content: '阿斗 609597441@qq.com',
        },
        {
          title: 'python爬虫开发',
          content: '蟹老板 128447307@qq.com',
        },
        {
          title: '图标UI设计',
          content: '卡布达巨人 1763615357@qq.com',
        },
      ],
    };
  }
  checkUpdate = async () => {
    if (__DEV__) {
      // 开发模式不支持热更新，跳过检查
      return;
    }
    let info;
    try {
      info = await checkUpdate(appKey);
    } catch (err) {
      Alert.alert('更新检查失败', err.message);
      return;
    }
    if (info.expired) {
      Alert.alert('提示', '您的应用版本已更新，点击确定下载安装新版本', [
        {
          text: '确定',
          onPress: () => {
            if (info.downloadUrl) {
              // apk可直接下载安装
              if (
                Platform.OS === 'android' &&
                info.downloadUrl.endsWith('.apk')
              ) {
                this.setState({
                  visible: true,
                });
                downloadAndInstallApk({
                  url: info.downloadUrl,
                  onDownloadProgress: ({received, total}) => {
                    this.setState({
                      received,
                      total,
                    });
                  },
                });
              } else {
                Linking.openURL(info.downloadUrl);
              }
            }
          },
        },
      ]);
    } else if (info.upToDate) {
      Alert.alert('提示', '您的应用版本已是最新.');
    } else {
      Alert.alert(
        '提示',
        '检查到新的版本' + info.name + ',是否下载?\n' + info.description,
        [
          {
            text: '是',
            onPress: () => {
              this.setState({
                visible: true,
              });
              this.doUpdate(info);
            },
          },
          {text: '否'},
        ],
      );
    }
  };
  //热更新
  doUpdate = async (info) => {
    try {
      const hash = await downloadUpdate(info, {
        onDownloadProgress: ({received, total}) => {
          this.setState({
            received,
            total,
          });
        },
      });
      this.setState({visible: false});
      Alert.alert('提示', '下载完毕,是否重启应用?', [
        {
          text: '是',
          onPress: () => {
            switchVersion(hash);
          },
        },
        {
          text: '否',
          onPress: () => {
            switchVersionLater(hash);
          },
        },
      ]);
    } catch (err) {
      Alert.alert('更新失败', err.message);
    }
  };
  render() {
    const {received, total, visible, DATA} = this.state;

    const renderItem = ({item}) => (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: '#FFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E6E6E6',
        }}>
        <Title>{item.title}</Title>
        <Text>{item.content}</Text>
      </View>
    );

    return (
      <View style={{height: '100%'}}>
        <View
          style={{
            paddingVertical: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={this.checkUpdate}>
            <Image
              style={{width: 100, height: 100}}
              source={require('../../public/image/logo.png')}
            />
          </TouchableOpacity>
          <Title>净音</Title>
          <Text style={styles.instructions}>
            当前原生版本号: {packageVersion}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#E6E6E6',
          }}>
          <Text>此app还在不断完善中，问题反馈、技术交流请联系以下</Text>
        </View>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
        />

        {/*<Card>*/}
        {/*  <Card.Title*/}
        {/*    title="rnApp、服务端开发"*/}
        {/*    subtitle="阿斗 609597441@qq.com"*/}
        {/*  />*/}
        {/*</Card>*/}
        {/*<Card>*/}
        {/*  <Card.Title*/}
        {/*    title="python爬虫开发"*/}
        {/*    subtitle="蟹老板 128447307@qq.com"*/}
        {/*  />*/}
        {/*</Card>*/}
        {/*<Card>*/}
        {/*  <Card.Title*/}
        {/*    title="图标UI设计"*/}
        {/*    subtitle="卡布达巨人 1763615357@qq.com"*/}
        {/*  />*/}
        {/*</Card>*/}
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Title>下载中</Dialog.Title>
          <Dialog.Content>
            <ProgressBar progress={received / total} />
          </Dialog.Content>
        </Dialog>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
