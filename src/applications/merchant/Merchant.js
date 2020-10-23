import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/merchant/merchants'

export default class Merchant extends BaseModel {
  static entity = 'merchants'

  static methodConf = conf
}
