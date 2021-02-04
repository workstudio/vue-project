import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/websites'

export default class Website extends BaseModel {
  static entity = 'websites'

  static methodConf = conf
}
