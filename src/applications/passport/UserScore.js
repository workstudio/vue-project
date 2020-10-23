import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/foundation-passport_user-score'

export default class UserAddress extends BaseModel {
  static entity = 'userScores'

  static fields () {
    return {
      id: this.increment(),
    }
  }

  static methodConf = conf
}
