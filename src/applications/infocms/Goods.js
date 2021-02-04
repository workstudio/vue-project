import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/goods'

export default class Goods extends BaseModel {
  static entity = 'goods'

  static methodConf = conf
}
