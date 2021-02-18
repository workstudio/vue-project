<template>
  <el-form-item :label="elem.options.name" prop="field">
  <el-cascader
    ref="cascadersimple"
    :options="elem.infos"
    :props="elem.props"
    :placeholder="elem.options.name"
    :value="currentValue"
    v-model="selectValue"
    @change="handleFormChange"
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
      selectValue: this.inputInfos[this.field],
      //input: this.inputInfos[this.field],
    }
  },
  computed: {
    input() {
      this.selectNode = this.$refs["cascadersimple"].getCheckedNodes();
      let vLength = this.selectValue.length;
      this.lastNode = vLength ? this.selectNode[vLength - 1] : {};
      return vLength ? this.selectValue[vLength - 1] : 0;
    },
  },
};
</script>
