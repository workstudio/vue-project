import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/subjects'

export default class Subject extends BaseModel {
  static entity = 'subjects'

  static methodConf = conf
}
