import { Model } from '@vuex-orm/core'
import localCache from '@/applications/common/LocalCache'
import DataModel from '@/applications/common/DataModel'

export default class BaseModel extends Model {
  static moduleConf = {}
  static keyField = 'id'
  static fetchDetail = false;

  constructor() {
    super()
    //this.methodConf = this.getMethodConf()
  }

  static getToken() {
    return localCache.getCache('token');
  }

  static formatAddDirtData(input, formFields) {
    let data = {};
    for (let field in formFields) {
      let item = formFields[field];
      let inputValue = input[field] || input[field] === 0 ? input[field] : '';
      data[field] = inputValue;
    }
    return data;
  }

  static formatDirtData(input, source, formFields) {
    let data = {};
    for (let field in formFields) {
      let item = formFields[field];
      let inputValue = input[field] ? input[field] : '';
      let sourceValue = source[field] ? source[field].valueSource : '';
      if (inputValue == sourceValue) {
        continue;
      }
      data[field] = inputValue;
    }
    return data;
  }

  static formatData(rDatas) {
    if (!rDatas.info) {
      return {};
    }
    let info = rDatas.info;
    rDatas.info = null;
    let base = info.base && info.relateData ? info.base : {};
    let relateData = info.base && info.relateData ? info.relateData : {};
    let obj = new DataModel(this, base, relateData, rDatas);
    return obj;
  }

  static formatDatas(rDatas) {
  	let datas = [];
    if (!rDatas.infos) {
      return datas;
	}
	let infos = rDatas.infos;
	rDatas.infos = null;
    infos.forEach((sItem, sIndex) => {
      rDatas.info = sItem;
      let obj = this.formatData(rDatas);
      datas.push(obj);
    });
    return datas;
  }

  static beforeCreate (model) {
    // Do domething.
  }

  static ssinsertOrUpdate(data) {
    //this.commit('rDatas', data.datas)
    //let d = {data: datas.data.datas.infos}
    //super.insertOrUpdate(d);
  }

  /*static infoValue(model, item, field, type = '') {
	return model.getInfosValue(item, field, type);
  }
  static infoRelate(model, item, field, rField) {
    return model.getInfosRelate(item, field, rField);
  }

  static getKeyInfos(field) {
    let relateAttributes = this.returnDatas.relateAttributes ? this.returnDatas.relateAttributes : {}
    let elems = relateAttributes[field] ? relateAttributes[field] : {}
    return elems;
  }

  static getKeyName(field, value) {
    let relateAttributes = this.returnDatas.relateAttributes ? this.returnDatas.relateAttributes : {}
    let elems = relateAttributes[field] ? relateAttributes[field] : {}
    return elems[value] ? elems[value] : value;
  }

  static getInfosValue(item, field, type = '') {
  	let value = item.base[field]
  	if (type == 'key') {
  	  return this.getKeyName(field, value)
	}
	return value;
  }

  static getInfosRelate(item, field, rField) {
  	let rData = item.relateData[field + 'Data'] ? item.relateData[field + 'Data'] : false;
  	if (!rData) {
  	  return '';
	}
	return rData[rField];
  }*/

  static formatUrl(url, params) {
    let preMark = url.includes('?') ? '&' : '?';
    url += preMark + `${Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')}`;
    return url;
  }

  static getMethodConf() {
    return {
      http: {},
      methods: {
        $fetch: {name: 'fetch', http: {url: '/:action', method: 'get'}},
        $get: {name: 'get', http: {url: '/:keyField', method: 'get'}},
        $create: {name: 'create', http: {url: '/:action', method: 'post'}},
        $update: {name: 'update', http: {url: '/:keyField', method: 'put'}},
        $delete: {name: 'delete', http: {url: '/:keyField', method: 'delete'}},
      },
      currentRole: localCache.getCache('currentRole'),
      currentEnv: localCache.getCache('currentEnv', ''),
    }
  }
}
