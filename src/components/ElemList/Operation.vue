<template>
  <div>
  <span v-for="operation in operations">
  <el-button size="mini" @click="handleOperation(operation)">
    {{operation.name}}
  </el-button>
  </span>
  </div>
</template>

<script>
import {button} from '@/applications/mixins/button';
export default {
  mixins: [button],
  data() {
    return {
      //actionType: 'popTable',
    }
  },
  computed: {
    operations() {
      return this.row[this.field].operations;
    }
  },
  methods: {
    handleOperation(operation) {
      let oType = operation.type ? operation.type : false;
      if (!oType) {
        return ;
      }
      
      this.actionType = oType;
      this.dealAction({row:this.row, operation: operation});
    },
  },
}
</script>
