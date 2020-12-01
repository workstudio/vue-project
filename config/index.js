'use strict'

let settings = {
  userType: '',
  title: 'Vue Admin Template',
}

import local from './local';
import current from './current';

export default Object.assign(settings, current, local);
