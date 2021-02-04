import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/attributes'

export default class Attribute extends BaseModel {
  static entity = 'attributes'

  static methodConf = conf
}
