import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/merchant/companies'

export default class Company extends BaseModel {
  static entity = 'companys'

  static methodConf = conf
}
