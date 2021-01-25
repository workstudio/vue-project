import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/pets'

export default class Pet extends BaseModel {
  static entity = 'pets'

  static methodConf = conf
}
