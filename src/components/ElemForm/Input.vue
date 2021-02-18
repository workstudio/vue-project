<template>
  <el-form-item :label="elem.options.name" prop="field">
      <el-input v-model="input" :placeholder="'请输入内容' + elem.options.name" @change="handleFormChange" :type="type" :rows="rows"></el-input>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      input: this.inputInfos[this.field],
      type: this.elem.typeExt ? this.elem.typeExt : '',
      rows: this.elem.rows ? this.elem.rows : 1,
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>
