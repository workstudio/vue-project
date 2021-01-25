import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/stores'

export default class Store extends BaseModel {
  static entity = 'stores'

  static methodConf = conf
}
