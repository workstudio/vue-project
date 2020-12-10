import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/zh-CN'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import localCache from '@/applications/common/LocalCache'
import * as baseMethod from '@/utils/base'
Vue.prototype.localCache = localCache
Vue.prototype.baseMethod = baseMethod

// 引入树形下拉框
/*import wl from "wl-vue-select";
import "wl-vue-select/lib/wl-vue-select.css"
Vue.use(wl);*/
// 引入文件管理器
import WlExplorer from "vue-explorer-canfront/src/pages";
import "vue-explorer-canfront/lib/vue-explorer.css"
Vue.use(WlExplorer);


import './icons' // icon
import './permission' // permission control
import './utils/exts/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  //const { mockXHR } = require('../mock')
  //mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  //locale: enLang // 如果使用中文，无需设置，请删除
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import {MessageBox, Message} from 'element-ui'
Vue.prototype.message = Message;
Vue.prototype.messageBox = MessageBox;
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
