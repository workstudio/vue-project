<template>
  <span>
    <el-select v-model="input" :placeholder="elem.options.name" :multiple="multiple" clearable style="width: 90px" class="filter-item" @change="handleChange">
      <el-option v-for="(item, index) in elem.infos" :key="index" :label="item" :value="index" />
    </el-select>
  </span>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      multiple: this.elem.multiple ? true : false,
      input: this.value
    }
  },
  computed: {
    test() {
    }
  },
  methods: {
    handleChange() {
      this.listQuery[this.field] = this.input;
      this.$emit('update.listQuery');
      //this.$emit('handleFilter');
    },
  }
}
</script>
