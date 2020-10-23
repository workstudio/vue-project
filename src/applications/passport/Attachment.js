import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/attachments'

export default class Attachment extends BaseModel {
  static entity = 'attachments'

  static methodConf = conf
}
