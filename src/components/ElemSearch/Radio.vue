<template>
    <el-radio-group v-model="fieldValue">
        <el-radio v-for="(option, optionKey) in elem.infos" :key="optionKey" :label="optionKey">{{option}}</el-radio>
    </el-radio-group>
</template>

<script>
export default {
  data () {
    return {
      fieldValue: '',
    };
  },
  props: {
    elem: {type: Object, default() {}},
    field: {type: String, default: ''},
    value: {type: String, default: ''},
  },
}
</script>
