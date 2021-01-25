import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/culture-categories'

export default class CultureCategory extends BaseModel {
  static entity = 'cultureCategories'

  static methodConf = conf
}
