import GeCode from 'vue-gecode'
import {fetchData} from '@/applications/mixins/fetchData'

export const entrance = {
  name: "smscode",
  mixins: [fetchData],
  components: {
    GeCode
  },
  data() {
    return {
      config: {
        startText: '获取验证码', //开始时候的文本
        endText: '再次获取', //获取验证码结束后文本
        totalTime: 60, //验证码倒计时总时间(秒)
        tickTime: 1, //验证码每次隔多久变一次(秒)
        activeClass: 'isRun', //倒计时执行期添加的class 默认 isRun
        computeText(num) { //自定义倒计时期间文本的显示内容
          return '重新获取 ' + num + 's'; //num 倒计时时间
        },
        canTodo: () => { //是否可以发送 
          let result = /^1[345678]\d{9}$/.test(this.mobile); //返回值判定是否可以发送
          if (!result) {
            this.message('手机号格式不正确');
          }
          return result;
        },
        todo: () => {
          this.generateSmsCode(); //canTode验证成功后执行 发送短信验证码//这里写验证码的获取程序
        },
        endCallback(type, config) { //发送完成后的回调
          console.log('发送完成后的回调', type, config); //type 回调产生原因  0: 时间结束   其他值由this.$refs.geCode.stop(1)调入自定义 config config配置  
          //this.signupin();
        },
        click(isRun) { //每次点击都会被调用
          //this.$store.commit('codeGenerated', true);
          //console.log(`当前验证码状态是:${isRun ? '发送中' : '可发送'}状态`) //isRun 是否在运行中
        },
        canUse: true, //是否可用   默认ture
        noCanClass: 'no-can', //不可用时的类名  默认no-can
      }
    }
  },
  computed: {
  },
   
  methods: {
    // 更换验证码
    replaceCaptchaUrl() {
      //this.$refs.captchaDoc['src'] = this.baseMethod.getCaptchaUrl(1)
    },
    closeCode() {
      this.$refs.geCode.stop(1);
    },
    generateSmsCode() {
      this.getModel('commonApi').$create({params: {action: 'generate-code'}, data: {mobile: this.mobile, type: 'signupin', 'captcha': '0824'}});
    },
  },
  watch: {
  }
}
