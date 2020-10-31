import {fetchData} from '@/applications/mixins/fetchData'
import {globalSettings} from '@/utils/base'
import localCache from '@/applications/common/LocalCache'

export const entrance = {
  name: "signupin",
  mixins: [fetchData],
  data() {
    return {
      loginType: '',

      needBind: false,
      captchaUrl: '',//this.baseMethod.getCaptchaUrl(),
      captcha: '',
      captchaRequire: false,
      mcode: '',
      mobile: '',
      username: '',
      password: '',
    }
  },
  computed: {
    cModel() {
      return this.getModel('passport', 'entrance');
    },
    userModel() {
      return this.getModel('passport', 'user');
    },
    returnData() {
      //return this.remoteRequest(this.cModel, 'token');
	},
  },
   
  methods: {
    signupin() {
      if (this.loginType == 'password') {
        if (!this.username) {
          this.message('请输入您的用户名');
          return
        }
        if (!this.password) {
          this.message('请输入您的密码');
          return
        }
      } else {
        if (!this.mobile) {
          this.message('请输入手机号');
          return
        }
        if (!this.mcode) {
          this.message('请输入您手机收到的验证码');
          return
        }
      }

      let data = {
        mobile: this.mobile,
        username: this.username,
        code: this.mcode,
        password: this.password,
        login_type: this.loginType,
        force_ajax: 1
      }
      this.cModel.$create({params: {action: 'token', env_type: this.envType}, data: data});
    },
  },
  watch: {
  	/*returnData(val, oldVal) {
  	  if (!val.code) {
  	  	return ;
	  }

      this.loading = false;
  	  if (val.code == 400) {
        this.message(val.message);
        return ;
	  }
      let rDatas = this.remoteDatas(this.cModel, this.actionCode);

      if (rDatas.access_token && rDatas.user.id) {
        localCache.setCache('token', rDatas.access_token);
        localCache.setCache('user', rDatas.user);
        localCache.setCache('manager', rDatas.manager);

        setTimeout(() => {
          let returnUrl = this.localCache.getCache('pointReturnUrl', '');
          returnUrl = !returnUrl ? this.localCache.getCache('return_url', '/') : returnUrl;
          this.localCache.setCache('pointReturnUrl', '');
          //this.$router.replace(returnUrl)
          window.location.href = returnUrl;
        }, 1500);
        this.message('登录成功');
	  } else {
        setTimeout(() => {
          this.captcha = '';
          //this.replaceCaptchaUrl();
        }, 600);
        let message = rDatas.message ? rDatas.message : '登录失败，请重新登录';
        this.message(message);
	  }
    },*/
  }
}
