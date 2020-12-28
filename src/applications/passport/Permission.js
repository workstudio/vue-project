import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/permissions'

export default class Permission extends BaseModel {
  static entity = 'permissions'
  static keyField = 'code'

  static methodConf = conf
}
