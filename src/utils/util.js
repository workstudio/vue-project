import globalSettings from '../../config/index'
import objectOperation from './object'

/**
 * 数组随机打乱(洗牌函数)
 * @param arr 需要打乱的数组
 * @return Array 最终打乱的数组
 */
const shuffle = function (arr) {
    let _arr = arr.slice()  //不修改原数组
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        // 变量的交换
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

// 深度拷贝
const cloneObj = (obj) => {
    if (!obj || typeof obj !== 'object') return
    const newObj = new obj.constructor() // 拷贝原型链上的
    for (const key in Object.getOwnPropertyDescriptors(obj)) { // 拷贝自己的成员
        newObj[key] = cloneObj(obj[key])
    }
    return newObj
}

const isPhone = () => {
  return (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent));
}

export function objectToArray(object) {
  var list = [];
  var i = 0;
  for (var key in object) {
    list[i] = object[key];
    i++;
  }
  return list;
}

export function isWeixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
  	return true;
  } else {
  	return false;
  }
} 

export function getCaptchaUrl(refresh = false) {
  let url = globalSettings.resturl + '/captcha.html';
  if (refresh) {
    url = url + "?" + Math.random();
  }
  return url;
}

export function emptyObject(obj) {
  return JSON.stringify(obj) == "{}";
}

export {
  globalSettings,
  isPhone,
}
