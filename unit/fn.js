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

//双向循环链表
export function DoublyCircularLinkedList() {
  let Node = function (element) {
    this.element = element;
    this.next = null;
    this.prev = null;
  };
  let length = 0,
    head = null,
    tail = null;

  this.append = function (element) {
    var node = new Node(element),
      current;
    if (!head) {
      head = node;
      tail = node;
      head.prev = tail;
      tail.next = head;
    } else if (this.indexOf(element) === -1) {
      current = head;
      while (current.next !== head) {
        current = current.next;
      }
      current.next = node;
      node.next = head;
      head.prev = node;
      node.prev = current;
      tail = node;
    } else {
      return;
    }

    length++;
    return true;
  };

  // 从链表中移除指定位置元素
  this.removeAt = function (position) {
    if (position > -1 && position < length) {
      // 值没有越界
      var current = head;
      var previous,
        index = 0;
      if (position === 0) {
        //  移除第一项
        head = current.next;
        head.prev = current.prev;
        current.prev.next = head;
        if (length === 1) {
          tail = null;
          head = null;
        }
      } else if (position === length - 1) {
        // 移除最后一项
        current = tail;
        current.prev.next = head;
        head.prev = current.prev;
        tail = current.prev;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
        current.next.prev = previous;
      }
      length--; // 更新列表的长度
      return current.element;
    } else {
      return null;
    }
  };

  // 在链表任意位置插入一个元素
  this.insert = function (position, element) {
    if (position < length) {
      // 检查越界值
      let node = new Node(element),
        current = head,
        index = 0;
      if (position === -1 && !head) {
        // 不存在，则在第一个位置添加
        head = node;
        tail = node;
        head.prev = tail;
        tail.next = head;
      } else if (position === length - 1) {
        this.append(element);
      } else {
        while (index++ < position) {
          current = current.next;
        }
        node.next = current.next;
        node.next.prev = node;
        node.prev = current;
        current.next = node;
      }
      length++;
      return true;
    } else {
      return false;
    }
  };

  // 把链表内的值转换成数组字符串
  this.toString = function () {
    let string = '';
    string = JSON.stringify(this.transArr());
    return string;
  };

  // 在链表中查找元素并返回索引值
  this.indexOf = function (element) {
    var current = head,
      index = 0;
    while (current && index + 1 <= length) {
      if (element === current.element) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  };

  // 从链表中移除指定元素
  this.remove = function (element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

  this.isEmpty = function () {
    return length === 0;
  };

  this.getHead = function () {
    return head;
  };
  //获取尾
  this.getTail = function () {
    return tail;
  };
  //获取长度
  this.size = function () {
    return length;
  };
  //转成数组
  this.transArr = function () {
    if (!head) {
      return [];
    }
    var result = [];
    var p = head;
    do {
      result.push(p.element);
      p = p.next;
    } while (p !== head);
    return result;
  };
  this.transArr2 = function () {
    if (!head) {
      return [];
    }
    var result = [];
    var p = head;
    do {
      result.push(p);
      p = p.next;
    } while (p !== head);
    return result;
  };
}
