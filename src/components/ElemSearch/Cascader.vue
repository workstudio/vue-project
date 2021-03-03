<template>
  <span class="filter-item">
  <el-cascader
    ref="cascadersimple"
    :options="elem.infos"
    :props="elem.props"
    :placeholder="elem.options.name"
    :value="currentValue"
    v-model="selectValue"
    @change="handleChange"
    clearable></el-cascader>
  </span>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      currentValue: this.listQuery[this.field],
      selectValue: this.listQuery[this.field],
    }
  },
  computed: {
    input() {
      this.selectNode = this.$refs["cascadersimple"].getCheckedNodes();
      let vLength = this.selectValue.length;
      this.lastNode = vLength ? this.selectNode[vLength - 1] : {};
      if (!this.elem.props.multiple) {
        return vLength ? this.selectValue[vLength - 1] : 0;
      }
      console.log('nnnnnnnnnn', this.selectNode, vLength, this.lastNode);
      let selects = '';
      for (let field in this.selectNode) {
        selects += this.selectNode[field].value + ',';
      }
      return selects;
    },
  },
  methods: {
    handleChange() {
      this.listQuery[this.field] = this.input;
      this.$emit('update.listQuery');
      //this.$emit('handleFilter');
    },
  },
};
</script>
