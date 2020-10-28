<template>
  <el-form-item :label="elem.optinos.name" prop="field">
      <el-input v-model="input" :placeholder="'请输入内容' + elem.label" @change="handleFormChange"></el-input>
      {{test}}
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
    test() {
      //console.log(this.elem, 'fffffffffffffffffffff', this.vlaue, this.field);
    }
  },
  methods: {
  },
}
</script>
