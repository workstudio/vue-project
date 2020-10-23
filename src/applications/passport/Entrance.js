import localCache from '@/applications/common/LocalCache'
import BaseModel from './BaseModel';

let conf = BaseModel.getMethodConf();
conf.http.url = '/passport';

export default class Entrance extends BaseModel {
  static entity = 'entrances'   

  static logout() {
    localCache.removeUser();
    this.$create({params: {action: 'logout'}, data: {}});
  }

  static signupinCache(res) {
    localCache.setCache('token', res.access_token);
    localCache.setCache('user', res.user);
    //localCache.setCache('userPlats', res.userPlats);
    //localCache.setCache('wechatDatas', res.wechats);
  }          

  static methodConf = conf    
}
