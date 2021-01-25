import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/knowledges'

export default class Knowledge extends BaseModel {
  static entity = 'knowledges'

  static methodConf = conf
}
