<template>
  <el-input v-model="input" :placeholder="elem.options.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @change="handleChange()" />
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
