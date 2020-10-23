<template>
  <div>
    <p @click="showPicker=true" class="gender">
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
      <van-picker
        class="gender-picker"
        :columns="columns"
        @change="onChange"
        show-toolbar
        :value-key="value"
        :title="fieldName"
        @cancel="showPicker=false"
        @confirm="showPicker=false"
      />
    </van-popup>
  </div>
</template>
<script>
import {Toast} from 'vant'

export default {
  data() {
    return {
      currentValue: this.value,
      showPicker: false,
      //columns: this.slideElems.valueDatas,//['杭州', '宁波', '温州', '嘉兴', '湖州']
      //indexDatas: this.slideElems.indexDatas
    };
  },
  props: {
    fields: {type: Object, default() {}},
    elems: {type: Object, default() {}},
    field: {type: String, default: ''},
    value: {type: String, default: ''},
    fieldName: {type: String, default: ''}
  },
  computed: {
    slideElems() {
      let indexDatas = [];
      let valueDatas = [];
      for (let key in this.elems) {
        indexDatas.push(key);
        valueDatas.push(this.elems[key]);
      }
      return {index: indexDatas, values: valueDatas}
    },
    columns() {
      let data = this.slideElems.values ? this.slideElems.values : [];
      return data;
    }
  },
  methods: {
    onChange(picker, value, index) {
      //Toast(`当前值：${value}, 当前索引：${index}`);
      let cIndex = this.slideElems.index[index];
      this.fields[this.field] = cIndex;
      this.currentValue = value;
      //let v = picker.getValues();
      this.showPicker = false;
    }
  }
};
</script>
