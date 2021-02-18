<template>
  <el-button type="primary" size="mini" @click="handleAuthority(row)">
    {{ $t('permission.editPermission') }}
  </el-button>
</template>

<script>
import {button} from '@/applications/mixins/button';
export default {
  mixins: [button],
  data() {
    return {
      actionType: 'authority',
    }
  },
  methods: {
    handleAuthority(data) {
      let keyField = this.model.keyField;
      this.model.$get({params: {keyField: data[keyField].valueSource}}).then(response => {
        if (response === false) {
          this.$notify({
            title: '错误',
            message: '信息有误',
            type: 'error',
            duration: 2000
          });
          return ;
        }
          console.log(response);
        let data = response.data;
        let permissionDatas = {
          code: data.code.value,
          name: data.name.value,
          checked: data.permission_data.value.checked,
          trees: data.permission_data.value.trees,
        }
        console.log(permissionDatas);
        this.dealAction(permissionDatas);
        //this.$refs.listAuthority.handleAuthority(response.data);
      })
    },
  },
}
</script>
