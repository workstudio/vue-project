const OSS = require('ali-oss')
import {globalSettings} from '@/utils/base'

export function client(ossCode) {
  let data = globalSettings.oss[ossCode];
  //后端提供数据
  return new OSS({
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.securityToken,
    region: data.region, // oss地区
    bucket: data.bucket
  })
}
