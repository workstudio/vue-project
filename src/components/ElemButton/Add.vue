<template>
  <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
    {{ $t('table.add') }}
  </el-button>
</template>

<script>
import {button} from '@/applications/mixins/button';
export default {
  mixins: [button],
  data() {
    return {
      actionType: 'add',
    }
  },
  methods: {
    handleAdd() {
      this.dealAction({});
      //this.$refs.listForm.handleCreate();
    },
  },
}
</script>
