<template>
  <div id="filesys">
    <WlExplorer
      ref="wl-explorer-cpt"
      :fileSystem="fileSystem"
      :currentSystem="currentSystem"
      :showIndex="showIndex"
      :pathDetail="pathDetail"
      :pathColumns="pathColumns"
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
      @deleteSelection="deleteSelection"
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
              :ref="'path-' + field"
              v-for="(formField, field) in formFields"
              :key="field"
              formName="path"
              :field="field"
              @dealFormChange="dealFormChange"
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
      <template>
        <file-view ref="fileView" class="file-view-components"></file-view>
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
                formName="upload"
                @dealFormChange="dealFormChange"
                v-for="(formField, field) in fileFormFields"
                :key="field"
                :field="field"
                :url="uploadUrl"
                :model="attachmentModel"
                :elem="formField"
                @beforeUpload="uploadBefore"
                @uploadSuccess="uploadSuccess"
                @afterSuccess="afterSuccess"
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
        </fade-in>
      </template>

    </WlExplorer>
  </div>
</template>

<script>
import FadeIn from "@/components/FileView/FadeIn"; // 导入文件管理器
import SubmitBtn from "@/components/FileView/SubmitBtn"; // 导入防抖提交组件
import FileView from "@/components/FileView/FileView.vue"; // 导入预览组件
import WlExplorer from "@/components/FileView/WlExplorer.vue"; // 导入预览组件
import {closeOtherLayout, arrayToTree} from "@/utils/exts/explorer"; // 导入关闭其他弹出类视图函数
import {listinfo} from '@/applications/mixins/listinfo';

import elemForms from '@/components/ElemForm'
const apiok = 200;

export default {
  name: "app",
  mixins: [listinfo],
  components: {
    FadeIn,
    SubmitBtn,
    FileView,
    WlExplorer,
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
      layout: {
        view: false, // 预览视图
        upload: false // 上传视图
      }, // 视图管理
      useUpload: true,
      size: "medium",
      upload_selected: "", // 所选上传文件目标路径
      uploadReg: false, //  是否校验上传文件
      uploadLimit: 50, // 上传个数限制
    };
  },
  created() {
    this.closeOtherLayout = closeOtherLayout;
    this.getList();
    this.getPathDetail(0);
    //this.getFileList()
  },
  computed:{
    attachmentModel() {
      return this.getModel('passport', 'attachment');
    },
    uploadUrl() {
      return this.attachmentModel.getUploadUrl();
    },
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
      this.listFileQuery.path_id = this.pathDetail.id ? this.pathDetail.id : 0;
      this.fetchRequest(this.attachmentModel, {query: this.listFileQuery, action: 'list'}).then(response => {
        if (Object.keys(this.fileFormFields).length == 0) {
          this.fileFormFields = response.addFormFields;
        }
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
        this.pathDetail = {id: 0};
        this.getFileList();
        return ;
      }

      this.getRequest(this.cModel, {query: {}, params: {keyField: pathId}}).then(response => {
        this.pathDetail = response;
        this.getFileList()
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
    fileSearch(pathDetail, forceUpdate = false) {
      let pathId = pathDetail ? pathDetail.id : 0;
      this.layout.upload = false;
      this.listQuery.parent_id = pathId;
      this.getList();
      if (pathId != this.pathDetail.id || forceUpdate) {
        this.getPathDetail(pathId);
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
        let addData = this.cModel.formatAddDirtData(this.inputInfos, this.formFields);
        let data = addData.data;
        this.cModel.$create({params: {}, data: data}).then(response => {
          if (response === false) {
            return ;
          }
          //this.list.unshift(this.inputInfos)
          //this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          });
          this.closeOtherLayout(this.fade);
          return this.fileSearch({id: data.parent_id});
        })
      })
    },
    // 删除文件
    deleteSelection(type, data) {
      let model = type == 'path' ? this.cModel : this.attachmentModel;
        model.$delete({params: {}, data: {'id': data}}).then(response => {
        if (response === false) {
          return ;
        }
        //this.list.unshift(this.inputInfos)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        return this.fileSearch(this.pathDetail, true);
      })
    },
    // 预览文件
    previewFile(row, previewType) {
      this.$refs.fileView.showDialog(row);
    },

    // 显示上传界面
    showUpload() {
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
      //this.fileSearch(res.pathDetail);
      this.$emit("uploadSuccess", res.pathDetail);
      this.closeUpload();
    },
    afterSuccess(res) {
      this.fileSearch(res.pathDetail);
      this.closeUpload();
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
