<template>
  <el-form-item :label="elem.options.name" prop="field">
      <el-input v-model="input" :placeholder="'请输入内容' + elem.options.name" @change="handleFormChange"></el-input>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      input: this.inputInfos[this.field],
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>
