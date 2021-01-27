<template>
  <el-dialog :visible.sync="dialogVisible" :append-to-body="appendToBody">
      <!-- 文件上传区 -->
      <template v-if="useUpload">
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


      dialogVisible: false,
      formLabelWidth: '60px',
      searchParam: {
        page: 1,
        page_size: 10,
        id: '',
        name: ''
      },
      tableData: [],
      total: 0,
      selectList: [],
      columns: [
        {
          label: '资源ID',
          width: '100',
          prop: 'id'
        },
        {
          label: '资源名称',
          width: '100',
          prop: 'name'
        },
        {
          label: '文件类型',
          width: '80',
          prop: 'fileTypeText'
        },
        {
          label: '上传时间',
          width: '120',
          prop: 'createTime'
        }
      ]
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
    fileSearch(pathId, forceUpdate = false) {
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
        let data = this.cModel.formatAddDirtData(this.inputInfos, this.formFields);
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
          return this.fileSearch(data.parent_id);
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
        return this.fileSearch(this.pathDetail.id);
      })
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
          this.previewOptions = {sources: [{type: "video/mp4", src: row.filepath}]};
          break;
        default :
          this.previewOptions = {url: row.filepath};
      }

      this.showPreview();

      //this.$emit("preview", row, this.showPreview());
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
    // 打开预览组件
    showPreview() {
      this.layout.view = true;
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
    showDialog(params) {
      const { fileType, lineType } = params;
      this.dialogVisible = true;
      // file_type: 资源类型['video' => '视频', 'audio' => '音频', 'apk' => '应用', 'image' => '图片', 'document' => '文档', 'other' => '其他']
      this.searchParam.file_type = fileType;
      // line_type: 业务线([1 => 线上教育, 2 => 碑帖, 3 => 智能笔]
      this.searchParam.line_type = lineType;
          console.log(this.dialogVisible, 'dddd');
      this.selectList = [];
      this.fetchData();
    },
    confirm() {
      if (!this.selectList.length) {
        this.$message.warning('请选择资源~');
        return;
      }
      this.$emit('confirm', this.selectList);
      this.dialogVisible = false;
    },
    fetchData() {
        return {};

      Api.getAssetsList(this.searchParam).then((response) => {
        this.tableData = response.data.infos.map((item) => {
          return Bean.assetBean(item);
        });
        this.total = response.data.totalNum;
      });
    },
    pageNoChange(val) {
      this.searchParam.page = val;
      this.fetchData();
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
      this.fetchData();
    },
    showPreviewDialog(item) {
      this.$refs.previewDialog.showDialog({
        fileType: item.fileType,
        fileUrl: item.fileUrl,
        fileId: item.fileId,
        name: item.name
      });
    }
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
