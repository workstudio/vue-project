<template>
  <el-form-item :label="elem.options.name" prop="field">
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input" :disabled="disabled" class="input-with-select" @change="handleFormChange">
        <el-select v-model="select" slot="prepend" placeholder="请选择" @change="handleSelect">
          <el-option
            v-for="(option, optionKey) in elem.infos"
            :key="optionKey"
            :label="option"
            :value="optionKey">
          </el-option>
        </el-select>
      </el-input>
    </div>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';

export default {
  mixins: [form],
  data() {
    return {
      input: this.inputInfos[this.field],
      select: '',
      disabled: true,
    }
  },
  methods: {
    handleSelect() {
      if (this.elem.infos[this.select] == '自定义') {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
}
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
