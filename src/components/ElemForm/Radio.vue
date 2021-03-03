<template>
  <el-form-item :label="elem.options.name" prop="field">
    <el-radio-group v-model="input" @change="handleFormChange">
        <el-radio v-for="(option, optionKey) in elem.infos" :key="optionKey" :label="optionKey">{{option}}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data () {
    return {
      input: this.inputInfos[this.field] ? this.inputInfos[this.field] + '' : null,
    };
  },
}
</script>
