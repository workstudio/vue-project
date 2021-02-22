<template>
  <div>
    <el-dialog :visible.sync="dialogPopTableVisible" title="Reading statistics">
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
import elemButtons from '@/components/ElemButton'
import elemSearchs from '@/components/ElemSearch'

export default {
  name: 'ListPopTable',
  data() {
    return {
      dialogPopTableVisible: false,
      pvData: [],
    }
  },
  props:{                     
  },
  methods: {
    handlePopTable(elems) {
      this.dialogPopTableVisible = true
    },
    dealAction(params) {
        console.log('oooooooooos');
      this.dialogPopTableVisible = true
      //return this.$emit('handlePopAdd');
    },
  }
}
</script>
