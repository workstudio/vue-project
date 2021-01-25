import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/pet-sorts'

export default class PetSort extends BaseModel {
  static entity = 'petSorts'

  static methodConf = conf
}
