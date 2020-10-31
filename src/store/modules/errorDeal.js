import {MessageBox, Message} from 'element-ui'
import * as popMethod from '@/utils/popup'

export function errorMessageBox(response) {
  popMethod.showMessage('error', response.message);
  
  // 508: Illegal token; 512: Other clients logged in; 514: Token expired;
  if (response.code === 508 || response.code === 512 || response.code === 514) {
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
}

export function errorMessage(error) {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}
