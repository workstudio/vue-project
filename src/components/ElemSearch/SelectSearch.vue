<template>
  <span class="filter-item">
    <el-select
      v-model="input"
      filterable
      remote
      reserve-keyword
      :placeholder="elem.options.name" 
      :multiple="multiple" 
      clearable 
      :remote-method="remoteMethod"
      @change="handleChange"
      :loading="loading">
      <el-option
        v-for="(name, key) in options"
        :key="key"
        :label="name"
        :value="key">
      </el-option>
    </el-select>
  </span>
</template>

<script>
import {form} from '@/applications/mixins/form';
import {fetchData} from '@/applications/mixins/fetchData';

export default {
  mixins: [form, fetchData],
  data() {
    return {
      multiple: this.elem.multiple ? true : false,
        options: this.elem.infos,
        loading: false,
        keyField: 'id',
        nameField: 'name',
        input: this.value
    }
  },
  mounted() {
    return [];
  },
  methods: {
    handleChange() {
      this.listQuery[this.field] = this.input;
      this.$emit('update.listQuery');
      //this.$emit('handleFilter');
    },
    remoteMethod(query) {
      if (query == '') {
        this.options = this.elem.infos;
        return ;
      }
      let model = this.getModel(this.elem.searchApp, this.elem.searchResource);;
      model.$fetch({query: {keyworkd: query, action: 'list', 'point_scene': 'keyvalue'}}).then(response => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = response.data;
          this.keyField = response.key;
          this.nameField = response.name;

        }, 200);
      })
    }
  }
}
</script>
