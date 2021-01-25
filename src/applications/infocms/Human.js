import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/humans'

export default class Human extends BaseModel {
  static entity = 'humans'

  static methodConf = conf
}
