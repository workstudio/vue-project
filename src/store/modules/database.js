import { Database } from '@vuex-orm/core'

import app from './app'
import errorLog from './errorLog'
import permission from './permission'
import settings from './settings'
import tagsView from './tagsView'
import user from './user'

import getters from './getters'

import passportDatabases from '@/applications/passport/database'
import merchantDatabases from '@/applications/merchant/database'
import thirdDatabases from '@/applications/third/database'

let databases = {
  passport: passportDatabases,
  merchant: merchantDatabases,
  third: thirdDatabases,
}
//databases = Object.assign(databases, merchantDatabases);
//databases = Object.assign(databases, passportDatabases);

const database = new Database()
const currentVuexs = {
  app,
  errorLog,
  permission,
  tagsView,
  settings,
  user
};

for (let key in databases) {
  for (let subKey in databases[key]) {
    database.register(databases[key][subKey], {}) 
    //database.register(databases[key], {}) 
  }
}

export {database, databases, currentVuexs, getters}
