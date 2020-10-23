import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/' + BaseModel.appCode + '/managers'
/*conf.methods = Object.assign(conf.methods, {
});*/

export default class Manager extends BaseModel {
  //static keyField = 'nickname'
  static entity = 'managers'

  static methodConf = conf
}
