<template>
  <div class="app-container">
    <el-dialog :visible.sync="dialogPopTableVisible" title="Reading statistics" :append-to-body="appendToBody" width="90%">
      <!--<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>-->
    <list-search :currentResource="currentResource" :searchFields="searchFields" :listQuery="listQuery" :model="cModel"></list-search>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
    <el-table-column v-if="haveSelection"
      type="selection"
      width="55">
    </el-table-column>

      <el-table-column  v-for="(fieldItem, field) in fieldNames" :key="field" :align="fieldItem.align" :min-width="fieldItem.width" :label="fieldItem.name" :prop="field" sortable="custom" :class-name="getSortClass(field)" v-if="fieldItem.hidden!=1">
        <template slot-scope="{row}">
          <component
            :row="row"
            :field="field"
            :fieldItem="fieldItem"
            :model="cModel"
            @dealAction="dealAction"
            :is="elemLists[row[field].showType]">
          </component>
        </template>
      </el-table-column>

    </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div>

    <pagination v-show="pageMeta.total>0" :total="pageMeta.total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="getList" />
    </el-dialog>
  </div>
</template>
<script>
import {listinfo} from '@/applications/mixins/listinfo';
import ListSearch from '@/views/common/ListSearch'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elemButtons from '@/components/ElemButton'
import elemSearchs from '@/components/ElemSearch'

export default {
  name: 'PopTable',
  mixins: [listinfo],
  components: {
    ListSearch,
    Pagination,
  },
  data() {
    return {
      haveSelection: true,
      dialogPopTableVisible: false,
      pvData: [],
      sortElem: {},
      searchFields: {},
      pageLinks: {},
      pageMeta: {total: 0},
      listQuery: {
        page: 1,
        per_page: 20,
        sort_elem: {},
      },
    }
  },
  props:{                     
    appendToBody: {type: Boolean, default: false}
  },
  methods: {
    handlePopTable(elems) {
      this.dialogPopTableVisible = true
      this.getList();
    },
    getList() {
      this.listQuery.sort_elem = JSON.stringify(this.sortElem);
      this.sortElem = {};
      this.listLoading = true
      this.fetchRequest(this.cModel, {query: this.listQuery, action: 'list'}).then(response => {
        this.list = response.data;
        this.addFormFields = response.addFormFields;
        this.updateFormFields = response.updateFormFields;
        this.fieldNames = response.fieldNames;
        this.pageLinks = response.links,
        this.pageMeta = response.meta,
        this.searchFields = response.searchFields,
        this.listQuery.per_page = this.pageMeta.per_page;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.sortElem[prop] = 'asc';
      } else {
        this.sortElem[prop] = 'desc';
      }
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.sortElem;
      if (!sort[key]) {
        return '';
      }
      if (sort[key] == 'asc') {
        return 'ascending';
      }
      return 'descending'
    },
    handleSelectionChange: function(selectionElems) {
      console.log(selectionElems, 'sssssssss');
    },
  }
}
</script>
