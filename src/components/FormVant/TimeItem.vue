<template>
  <div>
    <p @click="showPicker=true">
      <van-field
        class="border-bottom"
        :v-model="field"
        clearable
        disabled
        :label="fieldName"
        :placeholder="currentDate"
      />
    </p>
    <van-popup v-model="showPicker" position="bottom" :overlay="true">
      <van-datetime-picker
        @change="onChange"
        type="date"
        :min-date="minDate"
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
      currentDate: this.value,
      showPicker: false,
      minDate: new Date(),
    };
  },
  props: {
    fields: {type: Object, default() {}},
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
    onChange(picker) {
      //Toast(`当前值：${value}, 当前索引：${index}`);
      let values = picker.getValues();
      
      let valueStr = picker.getValues().join('-');
      this.currentDate = valueStr;
      this.fields[this.field] = valueStr;
      this.showPicker = false;
    }
  }
};
</script>
