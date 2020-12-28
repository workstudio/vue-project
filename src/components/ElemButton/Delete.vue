<template>
  <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteInfo(row, index)">
    {{ $t('table.delete') }}
  </el-button>
</template>

<script>
import {button} from '@/applications/mixins/button';
export default {
  mixins: [button],
  data() {
    return {
      actionType: 'delete',
    }
  },
  methods: {
    deleteInfo(data, index) {
      this.listLoading = true
      let keyField = this.model.keyField;
      let params = {keyField: data[keyField].valueSource};
      console.log(keyField, data, index, 'dddddddd', params);
      this.model.$delete({params: params}).then(response => {
        if (response === false) {
          return ;
        }
        this.$notify({
          title: '信息删除成功',
          message: '',
          type: 'success',
          duration: 2000
        })
        this.dealAction({});
        //setTimeout(() => {}, 1.5 * 1000)
      })
    },
  },
}
</script>
