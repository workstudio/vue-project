<template>
  <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
    {{ $t('table.search') }}
  </el-button>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import {button} from '@/applications/mixins/button';

export default {
  directives: { waves },
  mixins: [button],
  data() {
    return {
      actionType: 'search',
    }
  },
  methods: {
    handleFilter() {
      this.$emit('update.listQuery');
      //this.$emit('handleFilter');
      this.dealAction({});
    },
  },
}
</script>
