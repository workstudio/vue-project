<template>
  <el-input v-model="input" :placeholder="elem.label" style="width: 200px;" class="filter-item" :test="test" @keyup.enter.native="handleFilter" @change="handleChange()" />
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      input: this.value
    }
  },
  computed: {
    test() {
      //console.log(this.elem, 'fffffffffffffffffffff', this.input, this.field);
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
