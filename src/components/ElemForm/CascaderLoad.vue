<template>
  <el-form-item :label="elem.options.name" prop="field">
    <el-cascader
      :options="options"
      :props="props"
      @change="handleFormChange"
      v-model="selectValue"
      :show-all-levels="false"
      clearable></el-cascader>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';
import {fetchData} from '@/applications/mixins/fetchData';

export default {
  mixins: [fetchData, form],
  data() {
    let _self = this;
    return {
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const { level } = node;

          setTimeout(() => {
            let model = _self.getModel(_self.elem.loadApp, _self.elem.loadResource);;
            model.$fetch({query: {parent_id: node.value, action: 'list', 'point_scene': 'keyvalue'}}).then(response => {
              let keyField = response.key;
              let nameField = response.name;
              let elems = response.data;
              let nodes = [];
              elems.forEach(info => {
                nodes.push({
                  value: info[keyField],
                  label: info[nameField],
                  leaf: false,
                });
              });
              resolve(nodes);
            })
          }, 1000);
        }
      },
      //currentValue: this.inputInfos[this.field],

      selectValue: this.inputInfos[this.field],
    }
  },
  computed: {
    input() {
        console.log(this.selectValue, 'ccccvalue');
      let vLength = this.selectValue.length;
      return vLength ? this.selectValue[vLength - 1] : 0;
    },
    options() {
      let infos = this.elem.infos;
      if (!infos) {
        return [{value: 0, label: 'sss', leaf: false}];
      }
      let options = [];
      infos.data.forEach(info => {
        options.push({
          value: info[infos.key],
          label: info[infos.name],
          leaf: false,
        });
      });
      return options;
    }
  },
};
</script>
