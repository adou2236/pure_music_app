import cheerio from 'cheerio';
import pureStatic from '../public/static';

export async function getRealUrl(music_id) {
  const response = await fetch(`https://www.hifini.com/thread-${music_id}.htm`);
  const $ = cheerio.load(await response.text());
  return pureStatic.baseUrl + analysisPage($);
}

function analysisPage($) {
  var items;
  try {
    items = $('#player4').next().next()[0].firstChild.data;
    return getParenthesesStr(items);
  } catch (e) {
    return e;
  }
}

function getParenthesesStr(text) {
  text = text.replace(/\ +/g, '');
  text = text.replace(/\\s*|\t|\r|\n/g, '');
  let regex1 = /\[(.+?)\]/g;
  let regex2 = /\{(.+?)\}/g;
  let str1 = text.match(regex1)[0];
  let str2 = str1.match(regex2).toString();
  let arr = str2.split(',');
  return arr[2].split(':')[1].replace(/'/g, '');
}
