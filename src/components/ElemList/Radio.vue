<template>
  <div>
    <el-radio-group v-model="currentValue" @change="handleRowhange">
        <el-radio v-for="(option, optionKey) in row[field].value" :key="optionKey" :label="optionKey">{{option}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import {column} from '@/applications/mixins/column';
export default {
  mixins: [column],
  data() {
    return {
      currentValue: this.row[this.field].valueSource,
      rows: this.fieldItem.rowNum ? this.fieldItem.rowNum : 1,
      withPop: this.fieldItem.withPop ? this.fieldItem.withPop : 0,
    }
  },
  methods: {
  }
}
</script>
