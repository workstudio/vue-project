import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/culture-articles'

export default class CultureArticle extends BaseModel {
  static entity = 'cultureArticles'
  static fetchDetail = true;

  static methodConf = conf
}
