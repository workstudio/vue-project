<template>
  <el-form-item :label="elem.label" prop="field">
  <el-cascader
    :options="elem.infos"
    :props="elem.props"
    :value="currentValue"
    clearable></el-cascader>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      currentValue: this.inputInfos[this.field],
    }
  },
  props: {
    elem: {type: Object, default() {}},
    field: {type: String, default: ''},
    //value: {type: String, default: '220000'},
  },
};
</script>
