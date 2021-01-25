import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/articles'

export default class Article extends BaseModel {
  static entity = 'articles'

  static methodConf = conf
}
