<template>
  <el-popover trigger="hover" placement="top">
    <p>完整信息: {{row[field].valueSource}}</p>
    <div slot="reference" class="name-wrapper">
      <el-tag size="medium">{{ row[field].value }}</el-tag>
    </div>
  </el-popover>
</template>

<script>
import {column} from '@/applications/mixins/column';
export default {
  mixins: [column],
  data() {
    return {}
  },
}
</script>
