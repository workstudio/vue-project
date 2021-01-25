<template>
  <el-form-item :label="elem.options.name" prop="field" width="1000px">
    <div ref="editor" style="text-align:left" width="1000px"></div>
  </el-form-item>
</template>

<script>
import {form} from '@/applications/mixins/form';
import {fetchData} from '@/applications/mixins/fetchData';
import E from 'wangeditor'

export default {
  mixins: [fetchData, form],
  data() {
    return {
      input: this.inputInfos[this.field],
    }
  },
  mounted() {
    var editor = new E(this.$refs.editor)
    editor.config.height = 500;
    editor.config.onchange = (html) => {
      this.input = html;
      this.handleFormChange();
    }
      console.log(this.input, 'fffffffff');
    editor.create()
    editor.txt.html(this.input)
  },
  computed: {
    options() {
    }
  },
  methods: {
    getContent: function () {
      alert(this.input)
    },
    dealFormChange(value) {
    }
  }
};
</script>
