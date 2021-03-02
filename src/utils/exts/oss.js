const OSS = require('ali-oss')
import {globalSettings} from '@/utils/base'

export function client(data) {
  data = {
    accessKeyId: "LTAI4G5NpvfZdHjTCknaQp5a",
    accessKeySecret: "QYpCDL2scJNS5rg2UIKJsvgrUZXwVU",
    securityToken: "",
    region: "oss-cn-beijing",
    bucket: "tmfile"
  }
  //后端提供数据
  return new OSS({
    accessKeyId: data.accessKeyId,
    accessKeySecret: data.accessKeySecret,
    stsToken: data.securityToken,
    region: data.region, // oss地区
    bucket: data.bucket
  })
}
