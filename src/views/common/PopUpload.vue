<template>
  <el-dialog :visible.sync="popUploadVisible" :append-to-body="appendToBody" width="90%">
    <!-- 文件上传区 -->
    <template>
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
            formName="upload"
            @dealFormChange="dealFormChange"
            v-for="(formField, field) in fileFormFields"
            :key="field"
            :field="field"
            :url="uploadUrl"
            :model="attachmentModel"
            :elem="formField"
            @search="fileSearch"
            @beforeUpload="uploadBefore"
            @uploadSuccess="uploadSuccess"
            @uploadError="uploadError"
            :inputInfos.sync="fileInputInfos"
            :is="elemForms[formField.type]">
          </component>
        </el-form>
      </el-scrollbar>
      <!-- 按钮区 -->
      <div class="submit-btn-box">
        <submit-btn :size="size" @btn="saveUpload()" :status="load.upload">保存</submit-btn>
        <el-button :size="size" @click="layout.upload = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
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
    submitBtn,
    fileView,
    //cascaderLoad,
    //uploadItem,
  },
  props: {
    isOnly: {type: Boolean, default: false},
    appendToBody: {type: Boolean, default: false}
  },
  data() {
    // const vm = this;
    return {
      elemForms: elemForms,

      fileList: [],
      fileSystem: {local: '本地文件系统', oss: '阿里云OSS'},
      currentSystem: 'oss',
      showIndex: false,
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
        //del: false, // 删除
        //move: false, // 移动
        upload: false // 上传
      }, // loading状态
      fade: {folder: false}, // 弹出类视图管理
      fileProps: {
        name: "name",
        match: "name",
        suffix: "extension",
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
      uploadLimit: 50, // 上传个数限制
    };
  },
  computed:{
    attachmentModel() {
      return this.getModel('passport', 'attachment');
    },
    uploadUrl() {
      return this.attachmentModel.getUploadUrl();
    },
  },
  methods: {
    handlePopUpload(params) {
      this.popUploadVisible = true
      let row = params.row;
      let operation = params.operation;
      //this.getList(row, operation);
      this.attachmentModel.$create({params: {}, data: {point_scene: 'get_formelem'}}).then(response => {
        if (response === false) {
          return ;
        }
        this.fileFormFields = response.formFields;
        this.fieldNames = response.fieldNames;
        for (let field in this.formFields) {
          let item = this.formFields[field];
          this.inputInfos[field] = item.defaultValue ? item.defaultValue : '';
        }
        console.log(this.formFields, 'ffffffffffffffffffff');
        this.$nextTick(() => {
        })

        return ;
      })
    },
    // 关闭上传界面
    closeUpload() {
      this.layout.upload = false;
    },


    // 文件上传提交操作
    saveUpload() {
      let params = this.fileInputInfos;
      if (params.path_id || params.path_id === 0) {
        this.$refs["upload-files"][0].toUpload(params);
        return true;
      }
      this.$notify({title: '参数有误', message: '请选择目录', type: 'error', duration: 1000});
    },
    // 文件上传路径修改
    uploadPathChange([val]) {
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

    dealFormChange(formName, field, currentData) {
      if (formName == 'upload' && field == 'path_id') {
        this.pathChange(currentData);
      }
      if (formName == 'path' && field == 'parent_id') {
        this.parentChange(currentData);
      }

    },
    pathChange(currentData) {
      let currentValue = currentData.value;
      if (currentValue == 0) {
        this.fileInputInfos.path_full = '';
        this.$refs["upload-system"][0].setDisabled(false);
      } else {
        this.$refs["upload-system"][0].setDisabled();
        let extField = currentData.selectNode[0] ? currentData.selectNode[0].data.extField : '';
        this.fileInputInfos.path_full = currentData.selectNode[0] ? currentData.selectNode[0].data.extField2 : '';
        this.fileInputInfos.system = extField;
        this.$refs["upload-system"][0].setPointValue(extField);
      }
    },
    parentChange(currentData) {
      let currentValue = currentData.value;
      if (currentValue == 0) {
        this.$refs["path-system"][0].setDisabled(false);
      } else {
        this.$refs["path-system"][0].setDisabled();
        let extField = currentData.selectNode[0] ? currentData.selectNode[0].data.extField : '';
        this.$refs["path-system"][0].setPointValue(extField);
      }
    },
    pageNoChange(val) {
      this.searchParam.page = val;
      //this.fetchData();
    },
    selectionChange(val) {
      this.selectList = val;
    },
    currentChange(val) {
      if (this.isOnly && val) {
        this.selectList = [val];
      }
    },
    onSubmit() {
      this.searchParam.page = 1;
      //this.fetchData();
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

.form-inline {
  margin-bottom: 20px;
}
</style>
