<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      fit
      :data="list"
      row-key="keyField"
      style="width: 100%;margin-bottom: 20px;"
      border
      :lazy=lazy
      :indent="indent"
      :default-expand-all="defaultExpandAll"
      :tree-props="{children: 'subInfos', hasChildren: 'hasChildren'}"
      >

      <el-table-column v-for="(fieldName, field) in fieldNames" :key="field" :label="fieldName" :prop="field" align="center">
        <template slot-scope="{row}">
          <component
            :row="row"
            :field="field"
            :is="elemLists[row[field].showType]">
          </component>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <component
            v-for="button in currentResource[5]"
            :key="button.action"
            :elem="button"
            :model="cModel"
            :row="row"
            :index="$index"
            @dealAction="dealAction"
            :is="elemButtons[button.action]">
          </component>
          <!--<el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            {{ $t('table.publish') }}
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('table.draft') }}
          </el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <list-form ref="listForm" @handleFilter="handleFilter" :model="cModel" :updateFormFields="updateFormFields" :addFormFields="addFormFields" :fieldNames="fieldNames"></list-form>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/base'
import ListSearch from './components/ListSearch'
import ListForm from './components/ListForm'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {listinfo} from '@/applications/mixins/listinfo';
//import {fetchData} from '@/applications/mixins/fetchData';

export default {
  name: 'Default',
  mixins: [listinfo],
  components: {
    ListSearch,
    ListForm,
    Pagination,
  },
  directives: { waves },
  data() {
    return {
      lazy: true,
      defaultExpandAll:false,
      indent: 48,
      pvData: [],
      downloadLoading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.fetchRequest(this.cModel, {query: this.listQuery, params: {action: 'listinfo-tree'}}).then(response => {
          console.log(response);
        this.list = response.data;
        this.addFormFields = response.addFormFields;
        this.updateFormFields = response.updateFormFields;
        this.fieldNames = response.fieldNames;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList();
    },
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
    }
  }
}
</script>
