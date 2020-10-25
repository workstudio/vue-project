import localCache from '@/applications/common/LocalCache'
import {globalSettings} from '@/utils/base'
import {resetRouter} from '@/router'
import {fetchData} from '@/applications/mixins/fetchData'

export const currentUser = {
  name: "currentUser",
  mixins: [fetchData],
  components: {
  },
  data() {
    return {
      //avatar: this.userData.avatar,
      envType: globalSettings.envType,
      userData: localCache.getCache('user'),
      managerData: localCache.getCache('manager'),
    }
  },
  computed:{
    /*wechatDatas() {
      return this.userSort == 'merchant' ? localCache.getCache('wechatDatasMerchant', {}) : localCache.getCache('wechatDatas', {});
    },
    userPlats() {
      return this.userSort == 'merchant' ? localCache.getCache('userPlatsMerchant') : localCache.getCache('userPlats');
    },*/
    cModel() {
      return this.getModel('passport', 'user');
    },
  },
  methods: {
    // 更换验证码
    replaceCaptchaUrl() {
      this.$refs.captchaDoc['src'] = this.baseMethod.getCaptchaUrl(1)
    },
    logoutRequest() {
      this.cModel.$create({params: {action: 'logout'}, data: {}});
      localCache.removeUser();
      if (this.envType == 'backend' || this.envType == 'merchant') {
        localCache.removePermission();
        resetRouter();
	  }
    },

    /*execOperation(operation) {
      let url = this.userSort == 'merchant' ? '/mcenter/' : '/center/';
      url += operation;
      this.$router.push({path: url});
    },*/
  },
}
