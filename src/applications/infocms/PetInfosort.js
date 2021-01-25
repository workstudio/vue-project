import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/pet-infosorts'

export default class PetInfosort extends BaseModel {
  static entity = 'petInfosorts'

  static methodConf = conf
}
