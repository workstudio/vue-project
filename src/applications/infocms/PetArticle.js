import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/pet-articles'

export default class PetArticle extends BaseModel {
  static entity = 'petArticles'

  static methodConf = conf
}
