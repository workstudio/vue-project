import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/pet-petsorts'

export default class PetPetsort extends BaseModel {
  static entity = 'petPetsorts'

  static methodConf = conf
}
