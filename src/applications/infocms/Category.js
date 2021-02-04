import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/categories'

export default class Category extends BaseModel {
  static entity = 'categories'
  static keyField = 'code'

  static methodConf = conf
}
