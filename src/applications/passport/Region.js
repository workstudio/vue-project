import BaseModel from './BaseModel';
let conf = BaseModel.getMethodConf();
conf.http.url= '/passport/regions'

export default class Region extends BaseModel {
  static keyField = 'code'
  static entity = 'regions'

  static methodConf = conf
}
