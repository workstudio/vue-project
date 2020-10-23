import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/users'

export default class User extends BaseModel {
  static entity = 'users'

  static methodConf = conf
}
