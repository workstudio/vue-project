<template>
  <div>
    <p @click="showPicker=true">
      <van-field
        class="border-bottom"
        :v-model="field"
        clearable
        disabled
        :label="fieldName"
        :placeholder="currentValue"
      />
    </p>
    <van-popup v-model="showPicker" position="bottom" :overlay="true">
      <van-area
        :area-list="areaList" 
        :columns-num="columnNum"
        @change="onChange"
        :title="fieldName"
        @cancel="showPicker=false"
        @confirm="showPicker=false"
      />
    </van-popup>
  </div>
</template>
<script>
import {Toast} from 'vant'
import areaList from '@/data/area'

export default {
  data() {
    return {
      areaList: areaList, 
      currentValue: this.value,
      showPicker: false,
    };
  },
  props: {
    fields: {type: Object, default() {}},
    elems: {type: Object, default() {}},
    field: {type: String, default: ''},
    value: {type: String, default: ''},
    sort: {type: String, default: ''},
    fieldName: {type: String, default: ''}
  },
  computed: {
    columnNum() {
      return this.sort == 'city' ? 2 : 3;
    }
  },
  methods: {
    onChange(picker, value, index) {
      //Toast(`当前值：${value}, 当前索引：${index}`);
      let valueStr = ''
      let areaKey = []
      for (let index in value) {
        valueStr += value[index].name + ' ';
        areaKey.push(value[index].code);
      }
      this.currentValue = valueStr;
      this.fields[this.field] = areaKey;
      this.showPicker = false;
    }
  }
};
</script>
