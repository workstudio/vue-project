import {mapState} from 'vuex';
import localCache from '@/applications/common/LocalCache'

export const fetchData = {
  name: "fetchData",
  data() {
    return {
      appCode: this.$route.meta.app,
      modelCode: this.$route.meta.resource,
    }
  },
  computed: {
    ...mapState({
      models: state => state.baseData.cDatabases,
    }),
    cModel() {
      return this.getModel(this.appCode, this.modelCode);
	},
	currentResource() {
	  let currentPermissions = localCache.getCache('currentPermissions');
	  if (!currentPermissions[this.appCode]) {
	      return {};
      }
	  if (!currentPermissions[this.appCode][this.modelCode]) {
	      return {};
      }
      //console.log('fffffffffffffff', currentPermissions[this.appCode][this.modelCode]);
      return currentPermissions[this.appCode][this.modelCode];
    }
  },
  methods: {
  	getModel(appCode, mCode) {
  	  mCode = this.camelCode(mCode);
      return this.models[appCode][mCode];
	},
  	createRequest(cModel, params) {
	  return this._sendRequest('create', cModel, params);
	},
	fetchRequest(cModel, params) {
	  return this._sendRequest('fetch', cModel, params);
    },
  	_sendRequest(type, cModel, params) {
  	  //let envType = params.env_type ? params.env_type : '';
  	  //let query = params.query ? params.query : {};
  	  //let tokenKey = envType == 'merchant' ? 'tokenMerchant' : (envType == 'backend' ? 'tokenBackend' : 'token');
  	  //query['access-token'] = localCache.getCache(tokenKey, '');
  	  //params.query = query;
  	  switch (type) {
        case 'fetch':
          return cModel.$fetch(params);
          break;
        case 'create':
          return cModel.$create(params);
          break;
        }
	},
	resultFormat(action, rDatas) {
	  return rDatas;
	},
	fetchResult(action, val, oldVal, defaultVal = {}, cModel = false) {
	  if (val === false || !val.code) {
	  	return defaultVal;
	  }
	  cModel = !cModel ? this.cModel : cModel;
      let rDatas = this.watchCommon(val, cModel, action);
	  if (action == 'list' || action == 'mylist') {
        rDatas = this.baseMethod.objectToArray(rDatas);
	  }
      return this.resultFormat(action, rDatas);
	},
	camelCode(str) {
      let result = '';
      let arr = str.split('-');
      //result += arr[0].toString();
      for(let i = 0; i < arr.length; i++) {
          let str1 = arr[i].toString();
          let str2 = str1.charAt(0).toUpperCase();
          let str3 = str2 + str1.slice(1);
          result += str3;
      }
      return result;
	},
    checkDataFinish(pages) {
      this.currentPage = pages.page;
      if (this.currentPage < Math.ceil(pages.totalCount / pages.pageSize)) {
        return false;
      }
      return true;
    },

    /*remoteDatas(model, dataKey = 'listinfo', subKey = '') {
      let datas = model.getters('datas');
      //datas = JSON.parse(JSON.stringify(datas));
      let pDatas = datas[dataKey] ? datas[dataKey] : {};

      if (!subKey) { // infos info formFields relateAttributes baseFields listSearchAttributes pages
        return pDatas;
      }
      return pDatas[subKey] ? pDatas[subKey] : {};
    },*/

    /*remoteRequest(model, dataKey = 'listinfo') {
      let datas = model.getters('errors');
      return datas[dataKey] ? datas[dataKey] : false;
    },*/

    /*watchCommon(val, model, action) {
      //if (!val.code) {
        //return false;
      //}
      if (val.code != 200) {
        this.message(val.message);
      }
      this.loading = false;
      let rDatas = this.remoteDatas(model, action);
      if (this.baseMethod.emptyObject(rDatas)) {
        return {};
      }
      return rDatas;
    },*/
  },
};
