import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/website-goods'

export default class WebsiteGoods extends BaseModel {
  static entity = 'websiteGoods'

  static methodConf = conf
}
