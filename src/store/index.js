import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexORMAxios from 'plugin-axios-acan/src';
import { MessageBox, Message } from 'element-ui'
import {globalSettings} from '@/utils/base';
import * as popMethod from '@/utils/popup'
import localCache from '@/applications/common/LocalCache'

import baseData from './baseData';
Vue.use(Vuex);

let vuexs = {baseData};

import {database, currentVuexs, getters} from './modules/database';
vuexs = Object.assign(vuexs, currentVuexs);

VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseURL: globalSettings.resturl,
    url: '/',
    access_token: localCache.getToken(),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    onResponse(response, axios) {
      const res = response.data;
      if (res.code !== 200) {
      	popMethod.showMessage('error', res.message);
  
        // 508: Illegal token; 512: Other clients logged in; 514: Token expired;
        if (res.code === 508 || res.code === 512 || res.code === 514) {
          // to re-login
          popMethod.confirmMessage(
          	'warning', 
          	'You have been logged out, you can cancel to stay on this page, or log in again', 
          	'Confirm logout', 
          	'重新登录', 
          	'取消', 
          	function () {
              location.reload()
            }
          );
        }
        Promise.reject(new Error(res.message || 'Error')).catch((e) => {});
        return false;
      } else {
        return res.datas;
      }
    },
    onError() {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
	}
  }
})
//let a = [VuexORM.install(database)]

export default new Vuex.Store({
  getters,
  namespaced: true,
  modules: vuexs,
  plugins: [VuexORM.install(database)],
  strict: debug
})

/*const store = new Vuex.Store({
  modules: {
    app,
    settings,
  },
  getters
})

export default store*/
