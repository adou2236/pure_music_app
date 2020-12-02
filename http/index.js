import {Alert} from 'react-native';

/**
 *  method 请求接口名
 *  url 请求地址
 *  params 请求参数
 */
const xhr = (method, url, data = {}) => {
  console.log('执行请求', method, data);
  var query = {};
  if (method === 'POST') {
    query = {body: JSON.stringify(data)};
  }
  // params.method = method;
  //基本参数version，还可以放些其他的基本参数
  // params.version = '1.0';
  //结合Promise来使用，可以异步处理，无需再写cb；并且可以结合ES6,的then链式调用，使用方便
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: method, //定义请求方式，POST、GET、PUT等
      headers: {
        Accept: 'application/json', // 提交参数的数据方式,这里以json的形式
        'Content-Type': 'application/json',
      },
      ...query,
    })
      .then((responseJson) => {
        var code = responseJson.status; //返回直接映射完的数据，可以直接使用
        switch (
          code //做一些简单的处理
        ) {
          case 0: {
            resolve(responseJson.json());
            break;
          }
          case 10001: {
            Alert.alert('提示', '登录过期或在其他设备登录，是否重新登录', [
              {text: '取消', onPress: () => console.log('Cancel Pressed!')},
              {text: '登录', onPress: () => console.log('OK Pressed!')},
            ]);
            break;
          }
          default: {
            resolve(responseJson.json());
            break;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('请检查网络');
      });
  });
};

module.exports = xhr;
