import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/resources'

export default class Resource extends BaseModel {
  static keyField = 'code'
  static entity = 'resources'

  static methodConf = conf
}
