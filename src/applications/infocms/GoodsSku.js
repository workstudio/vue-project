import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url = '/infocms/goods-skus'

export default class GoodsSku extends BaseModel {
  static entity = 'goodsSkus'

  static methodConf = conf
}
