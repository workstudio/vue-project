<template>
  <div class="app-container">
    <list-search @handleAdd="handleAdd" @handleFilter="handleFilter" :currentResource="currentResource" :searchFields="searchFields" :listQuery="listQuery"></list-search>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column  v-for="(fieldItem, field) in fieldNames" :key="field" :align="fieldItem.align" :min-width="fieldItem.width" :label="fieldItem.name" :prop="field" sortable="custom" :class-name="getSortClass(field)">
        <template slot-scope="{row}">
          <component
            :row="row"
            :field="field"
            :fieldItem="fieldItem"
            :model="cModel"
            :is="elemLists[row[field].showType]">
          </component>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" min-width="180" class-name="small-padding fixed-width">
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

    <pagination v-show="pageMeta.total>0" :total="pageMeta.total" :page.sync="listQuery.page" :limit.sync="listQuery.per_page" @pagination="getList" />

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
import elemLists from '@/components/ElemList'
import elemButtons from '@/components/ElemButton'

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
      pvData: [],
      sortElem: {},
      downloadLoading: false,
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
  created() {
    this.getList()
  },
  methods: {
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
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
    }
  }
}
</script>
