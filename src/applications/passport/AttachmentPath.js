import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/attachment-paths'

export default class AttachmentPath extends BaseModel {
  static entity = 'attachmentPathes'

  static methodConf = conf
}
