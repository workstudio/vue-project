<template>
  <div id="filesys">
    <wlExplorer
      ref="wl-explorer-cpt"
      :fileSystem="fileSystem"
      :currentSystem="currentSystem"
      :showIndex="showIndex"
      :rootPaths="rootPaths"
      :pathDetail="pathDetail"
      :pathColumns="pathColumns"
      :attachmentPathModel="cModel"
      :fileColumns="fileColumns"
      :pathDatas="pathDatas"
      :fileDatas="fileDatas"
      :props="pathProps"
      :fileProps="fileProps"
      size="small"
      @handleFolder="handleFolder"
      @showUpload="showUpload"
      @closeUpload="closeUpload"
      @search="fileSearch"
      @previewFile="previewFile"
      @del="fileDel"
    >
      <!-- 操作文件夹滑入区 -->
      <fadeIn v-show="fade.folder">
        <h3 class="edit-header">
          <p>{{folder_form.Id?'编辑':'新增'}}文件夹</p>
        </h3>
        <el-scrollbar class="scroll">
          <el-form
            size="medium"
            ref="folder_form"
            label-position="top"
            :model="folder_form"
            class="folder_form rule-form"
            @keyup.enter.native="submitFolderFrom('folder_form')"
          >
            <component
              v-for="(formField, field) in formFields"
              :key="field"
              :field="field"
              :elem="formField"
              :inputInfos.sync="inputInfos"
              :is="elemForms[formField.type]">
            </component>
          </el-form>
        </el-scrollbar>
        <div class="submit-btn-box">
          <submit-btn @btn="submitFolderFrom('folder_form')" :status="load.folder"></submit-btn>
          <el-button size="medium" @click="fade.folder = false">取消</el-button>
        </div>
      </fadeIn>


      <!-- 文件预览区 -->
      <template v-if="usePreview">
        <file-view
          v-show="layout.view"
          ref="file-view"
          class="file-view-components"
          :previewType="previewType"
          :previewOptions="previewOptions"
          @close="layout.view = false"
        ></file-view>
      </template>

      <!-- 文件上传区 -->
      <template v-if="useUpload">
        <fade-in v-show="layout.upload">
          <h3 class="edit-header">上传文件</h3>
          <el-scrollbar class="scroll">
            <el-form
              :size="size"
              ref="template_form"
              label-position="top"
              class="template_form rule-form"
            >
              <component
                :ref="'upload-' + field"
                v-for="(formField, field) in fileFormFields"
                :key="field"
                :field="field"
                :elem="formField"
                :inputInfos.sync="fileInputInfos"
                :is="elemForms[formField.type]">
              </component>
              <!--<el-form-item label="文件路径">
                <cascaderLoad
                  class="u-full"
                  :size="size"
                  :rootPaths="rootPaths"
                  :attachmentPathModel="cModel"
                  v-model="upload_selected"
                  @change="uploadPathChange"
                ></cascaderLoad>
              </el-form-item>
              <el-form-item label="导入文件">
                <uploadItem
                  ref="upload-item"
                  :size="size"
                  :reg="uploadReg"
                  :url="uploadUrl"
                  :limit="uploadLimit"
                  :regFuc="uploadRegFuc"
                  :headers="uploadHeaders"
                  @beforeUpload="uploadBefore"
                  @uploadSuccess="uploadSuccess"
                  @uploadError="uploadError"
                ></uploadItem>
              </el-form-item>-->
            </el-form>
          </el-scrollbar>
          <!-- 按钮区 -->
          <div class="submit-btn-box">
            <submit-btn :size="size" @btn="saveUpload()" :status="load.upload">保存</submit-btn>
            <el-button :size="size" @click="layout.upload = false">取消</el-button>
          </div>
        </fade-in>
      </template>

    </wlExplorer>
  </div>
</template>

<script>
import fadeIn from "vue-explorer-canfront/src/components/fade-in"; // 导入文件管理器
import submitBtn from "vue-explorer-canfront/src/components/submit-btn"; // 导入防抖提交组件
import fileView from "@/components/FileView/file-view.vue"; // 导入预览组件
//import cascaderLoad from "@/components/FileView/cascader-load.vue"; // 引入滑入组件
//import uploadItem from "@/components/FileView/upload-item"; // 导入导入组件
import {closeOtherLayout, arrayToTree} from "@/utils/exts/explorer"; // 导入关闭其他弹出类视图函数
import {listinfo} from '@/applications/mixins/listinfo';

import elemForms from '@/components/ElemForm'
const apiok = 200;

export default {
  name: "app",
  mixins: [listinfo],
  components: {
    fadeIn,
    submitBtn,
    fileView,
    //cascaderLoad,
    //uploadItem,
  },
  data() {
    // const vm = this;
    return {
      elemForms: elemForms,

      fileList: [],
      fileSystem: {local: '本地文件系统', oss: '阿里云OSS'},
      currentSystem: 'oss',
      showIndex: false,
      rootPaths: {},
      formFields: {},
      fileFormFields: {},
      inputInfos: {},
      fileInputInfos: {},
      pathDetail: {},
      listFileQuery: {
        page: 1,
        per_page: 20,
        system: '',
      },
      listQuery: {
        page: 1,
        per_page: 20,
        parent_id: 0,
        system: '',
      },
      load: {
        folder: false,
      }, // loading管理
      fade: {
        folder: false,
      }, // 弹出类视图管理
      fileProps: {
        name: "name",
        match: "name",
        suffix: "extname",
      }, // 文件管理器配置项
      pathProps: {
        name: "path",
        match: "name",
        suffix: "SuffixName",
      }, // 文件管理器配置项
      folder_form: {
        ParentId: "",
        Name: "",
        system: "",
        preview: [],
        handle: [],
        Describe: "",
      }, // 文件夹表单
      fields: [],
      fileFields: [],
      fileFieldNames: {},
      usePreview: true,
      layout: {
        view: false, // 预览视图
        upload: false // 上传视图
      }, // 视图管理
      previewType: '',
      previewOptions: {},
      useUpload: true,
      size: "medium",
      upload_selected: "", // 所选上传文件目标路径
      uploadReg: false, //  是否校验上传文件
      uploadUrl: "http://api.supperuser.vip/passport/attachments/upload",
      uploadLimit: 50, // 上传个数限制
    };
  },
  created() {
    this.closeOtherLayout = closeOtherLayout;
    this.getList();
    this.getPathDetail(0);
    this.getPathList();
    //this.getFileList()
  },
  computed:{
    fileColumns() {
      let datas = [];
      let fields = [];
      for (let field in this.fileFieldNames) {
        fields.push(field);
        let data = {label: this.fileFieldNames[field].name, prop: field, width: this.fileFieldNames[field].width};
        datas.push(data);
      }
      this.fileFields = fields;
      return datas;
    },
    pathColumns() {
      let datas = [];
      let fields = [];
      for (let field in this.fieldNames) {
        fields.push(field);
        let data = {label: this.fieldNames[field].name, prop: field, width: this.fieldNames[field].width};
        datas.push(data);
      }
      this.fields = fields;
      return datas;
    },
    pathDatas() {
      let datas = [];
      this.list.forEach(info => {
        let data = [];
          this.fields.forEach(index => {
              data[index] = info[index].value;
              data.Type = 1;
          })
        datas.push(data);
      })
      return datas;
    },
    fileDatas() {
      let datas = [];
      this.fileList.forEach(info => {
        let data = [];
          this.fileFields.forEach(index => {
              data[index] = info[index].value;
          })
        datas.push(data);
      })
      return datas;
    },
  },
  methods: {
    getFileList() {
      this.listLoading = true
      let attachmentModel = this.getModel('passport', 'attachment');
      this.listFileQuery.path_id = this.pathDetail.id ? this.pathDetail.id : 0;
      this.fetchRequest(attachmentModel, {query: this.listFileQuery, action: 'list'}).then(response => {
        this.fileFormFields = response.addFormFields;
        this.fileList = response.data;
        this.fileFieldNames = response.fieldNames;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      this.fetchRequest(this.cModel, {query: this.listQuery, action: 'list'}).then(response => {
        this.list = response.data;
        this.formFields = response.addFormFields;
        this.updateFormFields = response.updateFormFields;
        this.fieldNames = response.fieldNames;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getPathDetail(pathId) {
      if (pathId == 0) {
        this.getFileList();
        return ;
      }

      this.getRequest(this.cModel, {query: {}, params: {keyField: pathId}}).then(response => {
        this.pathDetail = response;
        this.getFileList()
      })
    },
    getPathList() {
      this.fetchRequest(this.cModel, {query: {parent_id: 0, action: 'list', 'point_scene': 'keyvalue'}}).then(response => {
        this.rootPaths = response;
      })
    },
    download(data, func) {
      console.log(data, func);
    },
    /**
     * 根据关键词搜索文件
     * file: Object 文件属性
     * update: Boolean 数据是否需要更新（不需要表示已存在）
     */
    fileSearch(pathData) {
      this.listQuery.parent_id = pathData.id;
      //this.path = pathData;
      this.getList();
      if (pathData.id != this.pathDetail.id) {
        this.getPathDetail(pathData.id);
      }
    },

    // 获取文件夹列表
    /**
     * 编辑文件夹
     * act:Object 当前选中文件夹
     * type:String 操作类型 add添加edit编辑
     * file:Object 当前路径信息
     */
    handleFolder(act, type, file) {
      this.path = file;
      this.fade.folder = true;
      if (type === "add") {
        this.$refs["folder_form"].resetFields();
        this.folder_form.Id = "";
        this.folder_form.ParentId = file.id;
        return;
      }
      this.child_act_saved = act;
      this.folder_form = { ...act };
    },
    submitFolderFrom(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
            return ;
        }
        let data = this.cModel.formatAddDirtData(this.inputInfos, this.formFields);
        this.cModel.$create({params: {}, data: data}).then(response => {
          if (response === false) {
            return ;
          }
          //this.list.unshift(this.inputInfos)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          });
          return this.fileSearch();
        })
      })
    },
    // 删除文件
    fileDel(data) {
    },
    // 预览文件
    previewFile(row, previewType) {
      //let previewType = this.fileTypeItem(row, 'type');
      //previewType = 'image';
      //previewType = 'audio';
      //previewType = 'video';
      //previewType = 'xlsx';

      this.previewType = previewType;
      //row.url = 'http://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/22/%E5%BF%85-%E8%A6%81%E7%82%B9.png';
      //row.url = 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/27/%E4%BA%8C%E5%AD%97%E9%80%89%E6%8B%A9%E9%A2%98%E8%AF%AD%E9%9F%B3.mp3';
      //row.url = 'http://1254153797.vod2.myqcloud.com/41f91735vodsh1254153797/11bbe9245285890808875998543/BPgvrA4wHkkA.mp4';
      //row.url = 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/09/17/%E7%AB%A0%E8%8A%82.xlsx';
      switch (previewType) {
        case 'video':
          this.previewOptions = {sources: [{type: "video/mp4", src: row.url}]};
          break;
        default :
              console.log(row, 'rrrrrr');
          this.previewOptions = {url: row.filepath};
      }

      this.showPreview();

      //this.$emit("preview", row, this.showPreview());
    },

    // 显示上传界面
    showUpload() {
      /*this.upload_selected =  this.file.id;
      this.uoload_data = {
        parentPathId: this.file.pid,
        pathId: this.file.id,
        isCurrentFolder: true
      };*/
      if (this.useUpload) {
        this.layout.upload = true;
        this.closeOtherLayout(this.fade);
      } else {
        //this.$emit("showUpload");
      }
    },
    // 关闭上传界面
    closeUpload() {
      this.layout.upload = false;
    },
    // 打开预览组件
    showPreview() {
      this.layout.view = true;
    },


    // 文件上传提交操作
    saveUpload() {
      console.log(this.uoload_data, 'fffffffwwwww', this.handleUpload);
      console.log(this.$refs["upload-files"], 'aaaa');
      this.$refs["upload-files"][0].toUpload(this.uoload_data);
    },
    // 文件上传路径修改
    uploadPathChange([val]) {
        console.log(val, 'bbbbbbbbbbbbnnnnnn');
      const pathId = val[this.selfProps.pathId];
      this.uoload_data = {
        parentPathId: val[this.selfProps.pathPid],
        pathId,
        isCurrentFolder: pathId == this.file.id
      };
    },

    // 文件上传成功回调
    uploadSuccess(res) {
      this.$emit("uploadSuccess", res);
      this.closeUpload();
    },
    // 文件上传前回调
    uploadBefore(file) {
      this.$emit("uploadBefore", file, this.file);
    },
    // 文件上传失败回调
    uploadError(err) {
      this.$emit("uploadError", err);
      this.load.upload = false;
    },
    uploadRegFuc() {
    },
  }
};
</script>

<style>
#filesys {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  padding: 25px;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  box-sizing: border-box;
}
</style>
