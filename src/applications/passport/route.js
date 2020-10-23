import {_pviewsImport} from '@/util/_import'
import {routeMeta} from '@/util/util'
import metaDatas from '@/data/meta'

export const routes = [
  {path: '/center', component: _pviewsImport('layouts/Vplat'), children: [
    {path: 'home', name: 'center-home', component: _pviewsImport('center/vplat/index'), meta: routeMeta(metaDatas.passport, '个人中心')},
    {path: 'wechat', name: 'Wechat', component: _pviewsImport('center/vplat/Wechat'), meta: routeMeta(metaDatas.passport, '微信绑定')},
    {path: 'setting', name: 'center-setting', component: _pviewsImport('center/vplat/Setting'), meta: routeMeta(metaDatas.passport, '个人中心')},
    {path: 'address', name: 'center-address', component: _pviewsImport('center/vplat/Address'), meta: routeMeta(metaDatas.passport, '个人中心')},
    {path: 'address-edit', name: 'center-aedit', component: _pviewsImport('center/vplat/AddressEdit'), meta: routeMeta(metaDatas.passport, '个人中心')},
    //{path: 'collection', name: 'Collection', component: _pviewsImport('center/vplat/Collection'), meta: {title: '我的收藏', checkElems: ['authMerchant', 'merchantUserRoles', 'fsceneMerchant']} },
    //{path: 'evaluate', name: 'Evaluate', component: _pviewsImport('center/vplat/Evaluate'), meta: {title: '评价记录', checkElems: ['authMerchant', 'merchantUserRoles', 'fsceneMerchant']} },
    //{path: 'browse', name: 'Browse', component: _pviewsImport('center/vplat/Browse'), meta: {title: '浏览记录', checkElems: ['authMerchant', 'merchantUserRoles', 'fsceneMerchant']} },
    //{path: 'aevaluated', name: 'Aevaluated', component: _pviewsImport('center/vplat/Aevaluated'), meta: {title: '已经评价', checkElems: ['authMerchant', 'merchantUserRoles', 'fsceneMerchant']} },
    //{path: 'rate', name: 'Rate', component: _pviewsImport('center/vplat/Rate'), meta: {title: '评价商品', checkElems: ['authMerchant', 'merchantUserRoles', 'fsceneMerchant']} },
  ]},


  /*{path: '/fscene', name: 'fscene', component: _vhomeImport('fscene/index'), meta: routeMeta(metaDatas.passport, '场景', {rem: 'remVhome'})},*/
]
