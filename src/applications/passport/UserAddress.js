import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/foundation-passport_user-address'

export default class UserAddress extends BaseModel {
  static entity = 'userAddresses'

  static fields () {
    return {
      id: this.increment(),
    }
  }

  static methodConf = conf
}
