<template>
  <span>
    <el-select v-model="currentValue" placeholder="请选择" @change="handleRowChange" :disabled="disabled" clearable filterable>
      <el-option
        v-for="(option, optionKey) in row[field].value"
        :key="optionKey"
        :label="option"
        :value="optionKey">
      </el-option>
    </el-select>
  </span>
</template>

<script>
import {column} from '@/applications/mixins/column';
export default {
  mixins: [column],
  data() {
    return {
      disabled: false,
      currentValue: this.row[this.field].valueSource,
      rows: this.fieldItem.rowNum ? this.fieldItem.rowNum : 1,
      withPop: this.fieldItem.withPop ? this.fieldItem.withPop : 0,
    }
  },
  methods: {
  }
}
</script>
