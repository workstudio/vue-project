<template>
  <el-form-item :label="elem.options.name" prop="field">
    <el-select v-model="input" placeholder="请选择" @change="handleFormChange" :disabled="disabled">
      <el-option
        v-for="(option, optionKey) in elem.infos"
        :key="optionKey"
        :label="option"
        :value="optionKey">
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      disabled: false,
      input: this.inputInfos[this.field],
    }
  },
  methods: {
    setDisabled() {
      this.disabled = true;
    }
  }
}
</script>
