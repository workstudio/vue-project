'use strict'

let settings = {
  userType: '',
  title: 'Vue Admin Template',
}

//import local from './local';
//import current from './current';

module.exports = {
  //resturl: 'http://passport.test.supperuser.vip',
  resturl: process.env.VUE_APP_BASE_API,
  userType: '',
  title: 'local',
}

//module.exports = Object.assign(settings, current, local);
