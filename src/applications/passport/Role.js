import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/roles'

export default class Role extends BaseModel {
  static entity = 'roles'
  static keyField = 'code'

  static methodConf = conf
}
