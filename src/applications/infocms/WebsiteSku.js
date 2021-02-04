import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/website-skus'

export default class WebsiteSku extends BaseModel {
  static entity = 'websiteSkus'

  static methodConf = conf
}
