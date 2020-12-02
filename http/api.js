import xhr from './index';

/*
 * @Author: JeremyJone
 * @Date: 2020-03-05 18:55:36
 * @LastEditors  : JeremyJone
 * @LastEditTime : 2020-03-05 19:35:31
 * @Description: fetch封装示例，仅供学习使用。
 */

// 格式化数据的第三方库
// import qs from 'qs';
//这里定义接口请求的域名
/**
 * 根据环境变量进行接口的区分
 */
let BASE_URL = '';
let baseURLArr = [
  {
    type: 'development',
    url: 'http://192.168.1.37:3000',
  },
  {
    type: 'test',
    url: 'http://测试环境',
  },
  {
    type: 'production',
    url: 'http://生产环境',
  },
];
baseURLArr.forEach((item) => {
  console.log('当前环境为', process.env.NODE_ENV);
  if (process.env.NODE_ENV === item.type) {
    BASE_URL = item.url;
  }
});

/*
 *@Description:歌曲搜索。
 */
export function getAllMusic(data) {
  let url = BASE_URL + '/search';
  return xhr('POST', url, data);
}

export function addPlayTimes(music_id) {
  let url = BASE_URL + `/play/${music_id}`;
  return xhr('GET', url);
}
