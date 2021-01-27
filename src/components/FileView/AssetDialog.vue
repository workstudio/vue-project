<template>
  <el-dialog :visible.sync="dialogVisible" :append-to-body="appendToBody">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="ID：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="searchParam.id" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="searchParam.name" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <pagination
      ref="pageTable"
      :selection="!isOnly"
      :page-no="searchParam.page"
      :page-size="searchParam.page_size"
      :show-index="false"
      :data-list="tableData"
      :columns="columns"
      :total="total"
      @pageNoChange="pageNoChange"
      @currentChange="currentChange"
      @selectionChange="selectionChange"
    >
      <template v-slot:cell="props">
        <div v-if="props.column.label === '资源名称'">
          <el-button size="small" type="text" @click="showPreviewDialog(props.row)">{{
            props.row[props.column.property]
          }}</el-button>
        </div>
        <span v-else>{{ props.row[props.column.property] }}</span>
      </template>
    </pagination>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button icon="el-icon-upload2" @click="jumpPage">去上传</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </template>
    <preview-dialog ref="previewDialog"></preview-dialog>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination';
import PreviewDialog from '@/components/FileView/PreviewDialog';
//import Bean from '@/bean';

export default {
  name: 'AssetDialog',
  components: {
    Pagination,
    PreviewDialog
  },
  props: {
    isOnly: {type: Boolean, default: false},
    appendToBody: {type: Boolean, default: false}
  },
  data() {
    return {
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
  created() {},
  methods: {
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
    jumpPage() {
      this.dialogVisible = false;
      const { line_type } = this.searchParam;
      if (Number(line_type) === 1) {
        this.$router.push({ name: 'CoursewareList' });
      } else if (Number(line_type) === 2) {
        this.$router.push({ name: 'Resource' });
      } else if (Number(line_type) === 3) {
        this.$router.push({ name: 'AssetsList' });
      }
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

<style scoped>
.form-inline {
  margin-bottom: 20px;
}
</style>
