<template>
  <el-form-item :label="elem.options.name" prop="field">
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input" :disabled="disabledInput" class="input-with-select" @change="handleFormChange">
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
      disabledInput: true,
      select: this.initSelect(),
      input: this.inputInfos[this.field] + '',
      disabled: true,
    }
  },
  computed: {
  },
  mounted: function() {
    this.handleSelect(this.input);
  },
  methods: {
    initSelect() {
      let currentValue = this.inputInfos[this.field] + '';
      for (let option in this.elem.infos) {
        if (currentValue == option) {
          return currentValue;
        }
      }
      return this.elem.customValue + '';
    },
    handleSelect(value) {
      this.input = value;
      if (this.elem.customValue == this.select) {
        this.disabledInput = false;
      } else {
        this.disabledInput = true;
      }
      this.handleFormChange();
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
