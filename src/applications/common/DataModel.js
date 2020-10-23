export default class DataModel {

  baseValue(field, type = '') {
  	let value = this.baseData[field] ? this.baseData[field] : '';
  	if (!value) {
  	  return value;
	}
  	if (type == 'key') {
  	  value = this.getKeyName(field, value)
	}
	return value;
  }

  getKeyName(field, value) {
  	let elems = this.getKeyInfos(field);
    return elems[value] ? elems[value] : value;
  }

  relateValue(field, rField) {
  	let rData = this.relateDatas[field + 'Data'] ? this.relateDatas[field + 'Data'] : false;
  	if (!rData) {
  	  return '';
	}
	return rData[rField] ? rData[rField] : '';
  }

  getKeyInfos(field) {
    let elems = this.relateAttributes[field] ? this.relateAttributes[field] : {}
    return elems;
  }

  constructor(model, baseData, relateDatas, envDatas, globalDatas = {}) {
  	this.model = model;
  	this.baseData = baseData;
  	this.relateDatas = relateDatas;

  	this.envDatas = envDatas;
  	
    this.baseFields = envDatas.baseFields ? envDatas.baseFields : {};
    this.listSearchAttributes = envDatas.listSearchAttributes ? envDatas.listSearchAttributes : {};
    this.relateAttributes = envDatas.relateAttributes ? envDatas.relateAttributes : {};
    //this.globalDatas = envDatas.globalDatas ? envDatas.globalDatas : {};
    //this.infos = envDatas.infos ? envDatas.infos : {};
    //this.info = envDatas.info ? envDatas.info : {};
    this.pages = envDatas.pages ? envDatas.pages : {};
    this.formFields = envDatas.formFields ? envDatas.formFields : {};

  	this.globalDatas = globalDatas;
  }
}
