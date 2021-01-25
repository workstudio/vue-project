import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/brands'

export default class Brand extends BaseModel {
  static entity = 'brands'

  static methodConf = conf
}
