<template>
  <span class="filter-item">
    <el-date-picker
      v-model="input"
      type="datetimerange"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="至"
      :start-placeholder="'起始-' + elem.options.name"
      :end-placeholder="'截止-' + elem.options.name"
      @change="handleChange"
      align="right">
    </el-date-picker>
  </span>
</template>

<script>
import {form} from '@/applications/mixins/form';
export default {
  mixins: [form],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      input: ''
    };
  },
  computed: {
  },
  methods: {
    handleChange() {
      this.listQuery[this.field] = this.input[0] + '|' + this.input[1];
      this.$emit('update.listQuery');
      //this.$emit('handleFilter');
    },
  }
};
</script>
