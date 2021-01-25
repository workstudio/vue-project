import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/products'

export default class Product extends BaseModel {
  static entity = 'products'

  static methodConf = conf
}
