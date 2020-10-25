import router from './router'
import store from './store'
import localCache from '@/applications/common/LocalCache'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/exts/get-page-title'
import {globalSettings} from '@/utils/base'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
localCache.setCache('test', 0);

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasSignin = localCache.hasSignin();

  if (hasSignin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;//localCache.getCache('roles');
      const countNum = localCache.getCache('test');
      if (hasRoles) {
        localCache.setCache('test', countNum + 1);
      	//if (countNum < 10) {
        next()
        //}
      } else {
        try {
          // get user roles and permissions
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          //const { roles } = await store.dispatch('user/getInfo')
          const {permissions} = await store.dispatch('permission/myResources')
          //const permissions = ['admin'];

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', permissions);//['admin', 'editor']);//roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          localCache.setCache('test', countNum + 1);
      	  //if (countNum < 10) {
          next({ ...to, replace: true })
          //}
        } catch (error) {
          console.log(error, 'eeeee');
          // remove token and go to login page to re-login
          //localCache.removeUser();
          //localCache.removePermission();
          Message.error(error || 'Has Error')
          //next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
