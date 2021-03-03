<template>
  <el-button size="mini" type="danger" @click="deleteInfo(row, index)">
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
      let infoName = '指定的信息';
      if (data.name) {
        infoName = data.name.value;
      } else if (data.title) {
        infoName = data.title.value;
      }
      console.log(keyField, data, index, 'dddddddd', params);

      this.$confirm('此操作将永久删除-"' + infoName + '", 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
      }).then(() => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  },
}
</script>
