import { MessageBox, Message } from 'element-ui'

/*const isPhone = () => {
  return (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent));
}*/

const showMessage = function (type = 'error', message = '有个地方出错了', duration = 3 * 1000) {
  Message({
    message: message,
    type: type,
    duration: duration
  })
}

export function confirmMessage(type = 'warning', message = '描述', title = '标题', confirmText = '确认', cancelText = '取消', callback = function () {}) {
  MessageBox.confirm(message, title, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type: type
  }).then(callback);
  /*MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    confirmButtonText: 'Re-Login',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })*/
}

export {
  showMessage,
}
