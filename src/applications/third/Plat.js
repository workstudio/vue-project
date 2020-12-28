import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/third/plats'

export default class Plat extends BaseModel {
  static entity = 'plats'

  static methodConf = conf
}
