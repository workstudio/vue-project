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
      uploadUrl="http://api.supperuser.vip/passport/attachments/upload"
      :pathDatas="pathDatas"
      :fileDatas="fileDatas"
      :uploadHeaders="uploadHeaders"
      :props="pathProps"
      :fileProps="fileProps"
      size="small"
      @handleFolder="handleFolder"
      @upload="fileUpload"
      @download="download"
      @search="fileSearch"
      @preview="preview"
      @del="fileDel"
      @closeFade="closeOtherLayout(fade)"

      :upload-options="uploadOptions"
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
            :rules="folder_rules"
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
    </wlExplorer>
  </div>
</template>

<script>
import fadeIn from "vue-explorer-canfront/src/components/fade-in"; // 导入文件管理器
import submitBtn from "vue-explorer-canfront/src/components/submit-btn"; // 导入防抖提交组件
import {closeOtherLayout, arrayToTree} from "@/utils/exts/explorer"; // 导入关闭其他弹出类视图函数
import {listinfo} from '@/applications/mixins/listinfo';
import localCache from '@/applications/common/LocalCache'

import elemForms from '@/components/ElemForm'
const apiok = 200;

export default {
  name: "app",
  mixins: [listinfo],
  components: {
    fadeIn,
    submitBtn,
  },
  data() {
    const _GB = 1024 * 1024;
    // const vm = this;
    return {
      elemForms: elemForms,
      fileList: [],
      fileSystem: {local: '本地文件系统', oss: '阿里云OSS'},
      currentSystem: 'oss',
      showIndex: false,
      rootPaths: {},
      formFields: {},
      inputInfos: {},
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
      uploadHeaders: {
        Authorization: "Bearer " + localCache.getToken()
      },
      type: {
        folder: 1,
        img: 2,
        video: 3,
        other: 4,
      }, // 文件类型
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
      path: {}, // 路径数据
      folder_form: {
        ParentId: "",
        Name: "",
        system: "",
        preview: [],
        handle: [],
        Describe: "",
      }, // 文件夹表单
      folder_rules: {
        ParentId: [
          { required: true, message: "请选择文件路径", trigger: "blur" },
        ],
        Name: [
          { required: true, message: "请填写文件夹名称", trigger: "blur" },
        ],
      }, // 文件夹表单验证
      child_act_saved: {}, // 存储子组件数据，用于编辑更新
      tree_select_prop: {
        label: "Name",
        children: "Children",
      }, // 树形下拉框配置项
      uploadOptions: {
        aa: 1212,
      }, // 上传文件附加参数
      fields: [],
      fileFields: [],
      fileFieldNames: {},


      /*rource_type: {
        self: 1, // 自建
      },*/ // 数据来源类型
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
              data.Type = 0;
          })
        datas.push(data);
      })
      return datas;
    },
  },
  methods: {
    preview() {
    },
    getFileList() {
      this.listLoading = true
      let attachmentModel = this.getModel('passport', 'attachment');
      this.listFileQuery.path_id = this.pathDetail.id ? this.pathDetail.id : 0;
      this.fetchRequest(attachmentModel, {query: this.listFileQuery, action: 'list'}).then(response => {
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
    /**
     * @name 上传文件提交操作
     */
    fileUpload(file, cb) {
      this.uploadOptions.bb = 1;
      cb();
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
      this.path = pathData;
      this.getList();
      this.getPathDetail(pathData.id);
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
    //addData() {
    submitFolderFrom(formName) {
      //this.$refs['dataForm'].validate((valid) => {
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
          return this.$emit('handleFilter');
        })
      })
    },
    // 提交文件夹表单
    submitFolderFromold(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.load.folder = true;
          setTimeout(() => {
            this.load.folder = false;
            // let res_data = data.Data;
            let res_data = this.folder_form; // 由表单数据模拟服务器返回数据，此处应有服务器返回对应实体
            res_data.EditTime = res_data.CreateTime = "2019-11-11T11:11:11";
            res_data.Type = 1;
            if (!this.folder_form.Id) {
              // 新增
              if (this.folder_form.ParentId === this.path.id) {
                // 新增到当前路径
                this.file_table_data.unshift(res_data);
              } else {
                // 新增其他路径
                let _new_data = {
                  id: res_data.Id,
                  pid: res_data.ParentId,
                  path: res_data.Name,
                };
                this.$refs["wl-explorer-cpt"].updateHistoryData(
                  { Id: res_data.ParentId },
                  [_new_data]
                );
              }
            } else {
              // 编辑
              this.child_act_saved.Name = res_data.Name;
              this.child_act_saved.Describe = res_data.Describe;
            }
            this.fade.folder = false;
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success",
            });
          }, 1000);
        } else {
          return false;
        }
      });
    },
    // 删除文件
    fileDel(data) {
      let cannot_del_data = []; // 收集不可删除数据
      let normal_data_file = []; // 收集可删除文件
      let normal_data_folder = []; // 收集可删除文件夹
      data.forEach((i) => {
        i.RourceType !== this.rource_type.self
          ? cannot_del_data.push(i) // 不可删除数据
          : i.Type === this.type.folder
          ? normal_data_folder.push(i.Id) // 可删除文件夹
          : normal_data_file.push(i.Id); // 可删除文件
      });
      // 不可删除数据进行提示
      if (cannot_del_data.length > 0) {
        let _msg = '<p class="title">以下文件或文件夹不可删除，已自动过滤</p>';
        cannot_del_data.forEach((i) => {
          _msg += `<p class="msg">${i.Name}</p>`;
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: _msg,
          type: "warning",
          customClass: "mulit-msg",
        });
      }
      if (normal_data_folder.length === 0 && normal_data_file.length === 0)
        return;
      // 可删除数据正常删除
      let _data = {
        FolderIds: normal_data_folder,
        FolderFileIds: normal_data_file,
      };
      /*delFileApi(_data).then(({ data }) => {
        if (data.StatusCode === apiok) {
          this.file_table_data = this.file_table_data.filter(
            (i) => ![...normal_data_file, ...normal_data_folder].includes(i.Id)
          );
          this.$message({
            showClose: true,
            message: data.Message,
            type: "success",
          });
        }
      });*/
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
