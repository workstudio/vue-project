import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexORMAxios from 'plugin-axios-acan/src';
import {globalSettings} from '@/utils/base';
import localCache from '@/applications/common/LocalCache'
import * as errorDeal from './modules/errorDeal';

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
        errorDeal.errorMessageBox(res);
        Promise.reject(new Error(res.message || 'Error')).catch((e) => {});
        return false;
      } else {
        return res.datas;
      }
    },
    onError() {
      console.log('err' + error) // for debug
      errorDeal.errorMessage(error);
      return Promise.reject(error)
	}
  }
})
//let a = [VuexORM.install(database)]
const debug = false;//process.env.NODE_ENV !== "production";

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
