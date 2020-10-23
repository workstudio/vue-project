<template>
  <el-button type="primary" size="mini" @click="handleUpdate(row)">
    {{ $t('table.edit') }}
  </el-button>
</template>

<script>
import {button} from '@/applications/mixins/button';
export default {
  mixins: [button],
  data() {
    return {
      actionType: 'update',
    }
  },
  methods: {
    handleUpdate(data) {
      this.dealAction(data);
    },
  },
}
</script>
