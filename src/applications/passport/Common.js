import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport'

export default class Common extends BaseModel {
  static entity = 'commons'

  static methodConf = conf
}
