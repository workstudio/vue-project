import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/passport/attachments'

import {globalSettings} from '@/utils/base';

export default class Attachment extends BaseModel {
  static entity = 'attachments'

  static methodConf = conf

  static getUploadUrl() {
    return globalSettings.resturl + "/passport/attachments/upload";
  }
}
