<template>
  <div>
    <div class="upload-box " ref="upload-item">
      <el-upload
        class="upload-demo avatar-uploader"
        ref="upload"
        drag
        multiple
        with-credentials
        :action="url"
        :limit="limit"
        :headers="uploadHeaders"
        :file-list="fileList"
        :auto-upload="autoUpload"
        :before-upload="beforeUpload"
        :on-error="handleError"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"

        :http-request="uploadSectionFile"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"

        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script>
/**
 * auth:weilan
 * github: https://github.com/hql7
 * props: 输入
 * title:组件标题
 * templateCode:[String, Array]下载模板所需编码,多个模板时array
 * url:上传地址
 * options:上传附带参数
 * autoUpload:自动上传
 * uploadSuccess:父组件监听函数
 * reg:是否校验excel
 * path:是否显示文件路径
 * contract: 获取文件上传路径所需参数
 * defaultProps：路径树配置参数
 * view: 开启将在上传区下显示可预览文件列表区
 * iscom: 是否通用上传，仅区分通用上传使用内部通用逻辑还是采用外部逻辑
 * schedule-plan: 是否进度计划模块
 * emit: 输出
 * uploadSuccess：上传成功回调
 * length: 已上传文件列表长度
 * solt: 插槽
 *  templateMsg：下载模板的显示信息
 * --------> path模式为通用文件上传路径，文件夹的增删改均在内部完成。
 * --------> 同普通上传一致只需传入接口所需参数，输出均为上传成功回调。
 * --------> 手动上传模式均需要在父组件调用子组件方法，在父组件引入此组件时，给此组件加ref，然后this.$refs.[""].toUpload()即可!
 * --------> 此组件请使用v-if展示。使用范例：claim-apply.vue。
 */
import localCache from '@/applications/common/LocalCache'
import axios from 'axios';
import {client} from '@/utils/exts/oss.js';

export default {
  data() {
    return {
      fileList: [], // 已上传文件
      uploadHeaders: {
        Authorization: "Bearer " + localCache.getToken(),
        'Content-Type': 'multipart/form-data'
      },

      dialogImageUrl: '',
      dialogVisible: false,
      dataObj: {}, //存签名信息

      upOptions: {},
    };
  },
  props: {
    // 上传头信息
    // 上传地址
    url: {
      type: String,
      default: "" // 通用上传地址
    },
    model: {type: Function},  
    // 上传参数
    // 自动上传
    autoUpload: {
      type: Boolean,
      default: false
    },
    // 上传前校验
    reg: {
      type: Boolean,
      default: true
    },
    // 自定义校验函数
    regFuc: Function,
    // 上传个数限制
    limit: Number,
  },
  methods: {
    // 手动上传
    toUpload(options) {
      this.upOptions = options;
      this.$refs.upload.submit();
      //this.$emit("search", options.path_id);
    },
    // 上传前验证
    beforeUpload(file) {
      this.$emit('beforeUpload', file);
      // 不校验
      if (!this.reg) return true;
      // 自定义校验
      if (this.regFuc) return this.regFuc(file);
    },
    /**
     * [beforeUpload 上传图片前执行获取秘钥]
     * @return {[type]} [description]
     */
    /*beforeUpload() {
      return new Promise((resolve, reject) => {
        //从后台获取第一步所需的数据
        //getOssToken 获取OSS秘钥的接口地址
        this.$axios.get(getOssToken, {}).then(response => {
          this.dataObj = response.data
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },*/
    // 上传成功回调
    handleSuccess(res, file,fileList) {
      this.$emit("uploadSuccess", res, file, fileList);
    },
    // 上传失败回调
    handleError(err) {
      this.$emit("uploadError", err);
    },
    // 文件超出限制
    handleExceed() {
      this.$message.error("超出文件上传个数限制，最大上传个数为：1！");
    },
    /*handleExceed: function () {
      //_.$alert('请先删除选择的图片或视频，再上传', '提示', {
        type: 'warning'
      });
    },*/
  
  
  
    //methods
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    /*handleRemove(res, file) {
      var self = this;
      self.ad_url = '';
      var liItem = document.getElementsByClassName('hide-video-box')[0];
      liItem.innerHTML = '';
    },*/
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  
    uploadSectionFile(params) {
      let self = this;
      let file = params.file;
      let fileType = file.type;
      let isImage = fileType.indexOf('image') != -1;
      let isVideo = fileType.indexOf('video') != -1;
      let file_url = self.$refs.upload.uploadFiles[0].url;
      let size = file.size / 1024 / 1024 < 2;
        
      //if (size >= 2) {
        //self.$refs.upload.uploadFiles = []; 
        //return;
      //}
      let system = this.upOptions.system ? this.upOptions.system : '';
      switch (system) {
        case 'tmfile':
        case 'ossfile':
          let extension = self.baseMethod.getExtName(file.name);
          let filepath = this.upOptions.path_full + '/' + self.baseMethod.uuid() + extension;
          client(system).multipartUpload(filepath, file).then(result => {
            //下面是如果对返回结果再进行处理，根据项目需要
            self.$message({
              message: '上传成功',
              type: 'success'
            });
            let uploadInfos = {
              filename: file.name,
              filepath: filepath,
              mime_type: file.type,
              size: file.size,
              extension: extension.substring(1),
            };
            self.recordThirdAttachment(uploadInfos);
          }).catch(err => {
            self.$message.error('上传失败');
          })
          break;
        case 'local':
          this.uploadLocal(file);
          break;
        default:
          this.$notify({title: '文件类型有误', message: '文件类型有误，请重新选择', type: 'error', duration: 2000});
      }
      return true;
    },
    recordThirdAttachment(infos) {
      let self = this;
      for (let option in this.upOptions) {
        infos[option] = this.upOptions[option];
      }
      this.model.$create({params: {}, data: infos}).then(response => {
        if (response === false) {
          return ;
        }
        self.$refs.upload.uploadFiles = []; 
        self.$emit("search", self.upOptions.path_id);
      })
  
      return true;
    },
    uploadLocal(file) {
      let self = this;
      let formData = new FormData();
      formData.append('file', file);
      for (let option in this.upOptions) {
        formData.append(option, this.upOptions[option]);
      }
  
      axios.post(self.url, formData, {headers: this.uploadHeaders}).then(function (res) {
        if (res.data.code == 200) {
          //self.ad_url = res.data[0];
          //创建一个显示video的容器
          /*if (isVideo) {
            var liItem = document.getElementsByClassName('el-upload-list__item')[0];
            videoDiv.style.width = '278px';
            videoDiv.style.height = '415px';
            liItem.prepend(videoDiv);
          }*/
          self.$notify({title: '成功', message: '上传成功', type: 'success', duration: 2000});
          self.$refs.upload.uploadFiles = []; 
          
          self.$emit("search", self.upOptions.path_id);
          return;
        }
        self.$notify({title: '失败', message: '上传文件失败，请重新操作', type: 'error', duration: 2000});
      })
      .catch(function (err) {
        console.error(err);
      });
    },
  },
  computed: {
  },
};
</script>

<style lang="scss">
.upload-box {
  .el-upload,
  .el-upload-dragger {
    width: 100%;
  }
}
</style>
