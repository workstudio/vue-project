<template>
  <div>
        <van-radio-group v-model="radio" :name="fieldName">
          <van-radio :name="key">{{ elem }}</van-radio>
          <van-cell-group v-for="(elem, eIndex) in elems" :key="eIndex">
            <van-cell :title="elem" clickable @click="radio = eIndex">
              <van-radio slot="right-icon" :name="eIndex" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
  </div>
</template>
<script>
import {Toast} from 'vant'

export default {
  data() {
    return {
      radio: this.value,
    };
  },
  props: {
    elems: {type: Object, default() {}},
    field: {type: String, default: ''},
    value: {type: String, default: ''},
    fieldName: {type: String, default: ''}
  },
  methods: {
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    }
  }
};
</script>
