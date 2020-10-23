import {fetchData} from '@/applications/mixins/fetchData'

export const entrance = {
  name: "wechat",
  mixins: [fetchData],
  data() {
    return {
      needBind: false,
      currentWechat: this.localCache.getCache('wechat'),
    }
  },
  computed: {
    userPlatRequest() {
      return this.remoteRequest(this.userModel, 'userplat');
    },
  },
   
  methods: {
  },
  watch: {
    userPlatRequest(val, oldVal) {
      if (!val.code) {
        return ;
      }
      if (val.code != 200) {
        this.message(val.message);
        this.loading = false
      }
      this.loading = false;
      let rDatas = this.remoteDatas(this.userModel, 'userplat');
      if (!rDatas) {
        return ;
      }
      
      let platStatus = rDatas.platStatus;
      if (platStatus == 'needBind') {
        this.localCache.setCache('pointReturnUrl', window.location.href);
        this.needBind = 1;
      } else if (platStatus == 'requestAgain') {
        window.location.href = this.currentWechat.authUrl + '&point_param=' + this.currentSort;
      } else {
      	this.cModel.writeCache(rDatas);
        let returnUrl = this.localCache.getCache('return_url', '/');
        returnUrl = returnUrl.includes('mlogout') ? '/' : returnUrl;
        window.location.href = returnUrl;
      }
    },
  }
}
