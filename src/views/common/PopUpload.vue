<template>
  <el-dialog :visible.sync="popUploadVisible" :append-to-body="appendToBody" width="90%">
    <!-- 文件上传区 -->
    <template>
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
            :listType="listType"
            :field="field"
            :url="uploadUrl"
            :model="attachmentModel"
            :elem="formField"
            @beforeUpload="uploadBefore"
            @afterSuccess="afterSuccess"
            @uploadError="uploadError"
            :inputInfos.sync="fileInputInfos"
            :is="elemForms[formField.type]">
          </component>
        </el-form>
      </el-scrollbar>
      <!-- 按钮区 -->
      <div class="submit-btn-box">
        <submit-btn :size="size" @btn="saveUpload()">保存</submit-btn>
        <el-button :size="size" @click="popUploadVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import submitBtn from "vue-explorer-canfront/src/components/submit-btn"; // 导入防抖提交组件
import {listinfo} from '@/applications/mixins/listinfo';

import elemForms from '@/components/ElemForm'

export default {
  name: "app",
  mixins: [listinfo],
  components: {
    submitBtn,
  },
  props: {
    appendToBody: {type: Boolean, default: false}
  },
  data() {
    // const vm = this;
    return {
      elemForms: elemForms,
      popUploadVisible: false,

      currentSystem: 'oss',
      fileFormFields: {},
      fileInputInfos: {},
      load: {
        folder: false,
        upload: false // 上传
      },
      listType: 'text',
      fade: {folder: false}, // 弹出类视图管理
      fields: [],
      fileFields: [],
      fileFieldNames: {},
      size: "medium",
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
      this.listType = params.elem.filetype == 'image' ? 'picture' : 'text';
        console.log(params, this.listType, 'ffffff');
      let operation = params.operation;
      //this.getList(row, operation);
      this.attachmentModel.$create({params: {}, data: {point_scene: 'get_formelem'}}).then(response => {
        if (response === false) {
          return ;
        }
        this.fileFormFields = response.formFields;
        this.fieldNames = response.fieldNames;
        for (let field in this.fileFormFields) {
          let item = this.fileFormFields[field];
          this.fileInputInfos[field] = item.defaultValue ? item.defaultValue : '';
        }

        return ;
      })
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
    afterSuccess(res) {
      this.$emit("afterSuccess", res.fileInfo);
      this.popUploadVisible = false;
        console.log('aaaaaaaa', this.$refs['template_form']);
      this.$refs['template_form'].resetFields();
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
