'use strict'

let settings = {
  resturl: process.env.VUE_APP_BASE_API,
  userType: '',
  //title: 'Vue Admin Template',
  title: 'local',
}

import local from './local';
import current from './current';

/*export default {
  //resturl: 'http://passport.test.supperuser.vip',
  userType: '',
  title: 'local',
}*/

module.exports = Object.assign(settings, current, local);
