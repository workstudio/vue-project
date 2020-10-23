import {_pviewsImport} from '@/utils/_import'
import {asyncRoutes, constantRoutes} from '@/router'
import localCache from '@/applications/common/LocalCache'
import entranceModel from '@/applications/passport/Entrance'
import * as popMethod from '@/utils/popup'
import {globalSettings} from '@/utils/util'
import Layout from '@/layout'
import Middle from '@/layout/middle'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/*export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}*/
export function formatAsyncRoutes(permissions) {
  const routes = []

  let currentPermissions = localCache.getCache('currentPermissions');
  let tmpRoute = {};
  let permission = {};
  for (let pKey in permissions) {
    permission = permissions[pKey];
    let route = formatRoute(permission);
    formatPermission(permission, route, currentPermissions);
    if (!route) {
        continue;
    }
    if (permission.childrenInfos) {
      route.children = formatAsyncRoutes(permission.childrenInfos);
    }
    routes.push(route);
  }
  return routes;
}

function formatRoute(permission) {
  let display = permission.display;
  let resourceCode = permission.resource_code;
  if (display > 3 && !permission.route_path) {
    return false;
  }
  let route = {
    path: display == 1 || display == 2 ? '/r' + permission.code : permission.app + '/' + permission.action + '/' + permission.controller,
    //component: Layout,
    name: permission.name,
    title: permission.name,
    meta: {title: permission.name, icon: 'table', resource: resourceCode, app: permission.app}
  }
  if (display == 1) {
    route.component = Layout;
  }
  if (display == 2) {
    route.component = Middle;
  } 
  if (display == 3) {
    let routePath = permission.route_path ? permission.route_path : permission.action + '/default';

    let rComponent = _pviewsImport(`${routePath}`);
    route.component = rComponent;
    //route['component'] = _import(`modules/${menuList[i].url}`) || null
  }
  return route;
}

function formatPermission(permission, route, currentPermissions) {
  let display = permission.display;
  let resourceCode = permission.resource_code;
  if (resourceCode) {
    if (!currentPermissions[permission.app]) {
      currentPermissions[permission.app] = {};
    }
    if (!currentPermissions[permission.app][resourceCode]) {
      currentPermissions[permission.app][resourceCode] = {};
    }
    if (!currentPermissions[permission.app][resourceCode][display]) {
      currentPermissions[permission.app][resourceCode][display] = {};
    }
    permission.route = route;
    currentPermissions[permission.app][resourceCode][display][permission.action] = permission;
    localCache.setCache('currentPermissions', currentPermissions);
  }
}

const state = {
  routes: [],
  addRoutes: [],
  roles: [],
  //currentRoutes: {}
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  /*SET_CURRENT_ROUTES: (state, routes) => {
    state.currentRoutes = routes
  }*/
}

const actions = {
  generateRoutes({ commit }, permissions) {
    return new Promise(resolve => {
      localCache.setCache('currentPermissions', {});
      //const routes = asyncRoutes || []
      const routenews = formatAsyncRoutes(permissions);
      commit('SET_ROUTES', routenews)
      resolve(routenews);
    })
  },

  // get user info
  myResources({ commit, state }) {
    return new Promise((resolve, reject) => {
      entranceModel.$fetch({params: {action: 'my-routes'}}).then(response => {
        const data = response
        const {roles, roleDetails, permissions} = data;

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        let cRole = localCache.getCache('currentRole');
        if (!cRole || !roles.includes(cRole)) {
          cRole = roles[0];
          localCache.setCache('currentRole', cRole);
        }

        localCache.setCache('routes', permissions);
        localCache.setCache('roleDetails', roleDetails);
        localCache.setCache('roles', roles);
        commit('SET_ROLES', roles);
        resolve({permissions: permissions[cRole]});
        //resolve(data);//{permissions: permissions[cRole]});
      }).catch(error => {
        reject(error)
      })
    })
  },
  // dynamically modify permissions
  changeRole({commit}, role) {
    commit('SET_ROLES', []);
    localCache.setCache('currentRole', role);
  },
  getPointRoute({commit}, params) {
    commit('SET_ROLES', []);
    localCache.setCache('currentRole', role);
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
