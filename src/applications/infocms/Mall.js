import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/malls'

export default class Mall extends BaseModel {
  static entity = 'malls'

  static methodConf = conf
}
