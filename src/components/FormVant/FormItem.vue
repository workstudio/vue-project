<template>
  <div>
    <div v-if="showBack">
      <van-nav-bar :title="title" left-arrow @click-left="goBack"/>
    </div>
    <div v-else>
      <van-nav-bar :title="title" />
    </div>
    <van-cell-group  v-for="(item, index) in formFields" :key="index">
      <div v-if="item.sort === 'key'">
        <PickerItem :field="index" :fields="fields" :fieldName="item.name" :value="info.baseValue(index, 'key')" :elems="info.getKeyInfos(index)"></PickerItem>
      </div>
      <div v-else-if="item.sort === 'city'">
        <AreaItem :field="index" sort="city" :fields="fields" :fieldName="item.name" :value="info.baseValue(index)" :elems="info.getKeyInfos(index)"></AreaItem>
      </div>
      <div v-else-if="item.sort === 'radio'">
        <RadioItem :field="index" :fieldName="item.name" :value="info.baseValue(index)" :elems="info.getKeyInfos(index)"></RadioItem>
      </div>
      <div v-else-if="item.sort === 'daytime'">
        <TimeItem :field="index" sort="daytime" :fields="fields" :fieldName="item.name" :value="info.baseValue(index)" ></TimeItem>
      </div>
      <div v-else-if="item.sort === 'switch'">
        <van-cell-group><van-switch-cell v-model="fields[index]" :title="item.name" /></van-cell-group>
      </div> 
      <div v-else-if="item.sort === 'textarea'">
        <van-field type="textarea" class="border-bottom" v-model="fields[index]" :label="item.name" rows="2" :placeholder="'请输入' + item.name" @input="inputValues(index, $event)" :value="info.baseValue(index)" />
      </div> 
      <div v-else>
        <van-field class="border-bottom" v-model="fields[index]" :label="item.name" :placeholder="'请输入' + item.name" @input="inputValues(index, $event)" :value="info.baseValue(index)" />
      </div> 
    </van-cell-group>
    <div class="normal">
      <van-button size="normal" class="normal-btn" type="primary" @click="post" >保存</van-button>
      <van-button @click="goBack" size="normal" class="normal-btn normal-btn-default">取消</van-button>
    </div>
</div>
</template>

<script>
import PickerItem from './PickerItem'
import AreaItem from './AreaItem'
import RadioItem from './RadioItem'
import TimeItem from './TimeItem'

export default {
  components: {
    PickerItem,
    RadioItem,
    AreaItem,
    TimeItem,
  },
  data() {
    return {
      fields: {},
      username: '',
      show: true,
    };
  },
  props:{
    model: {type: Function},
    info: {type: Object},
    //formFields: {type: Object},
    title: {type: String, default: ''},
    showBack: {type: String, default: ''},
  },
  computed: {
    formFields() {
      return this.info.formFields;
      //return this.formFields
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    inputValues(index, value) {
      this.fields[index] = value;
      this.info[index] = value;
    },
    post() {
      if (this.baseMethod.emptyObject(this.fields)) {
        this.$notify('您没做任何改变');
      }

      for (let index in this.formFields) {
        let elem = this.formFields[index];
        if (elem.required && !this.fields[index]) {
          this.$notify(elem.name + '不能为空');
          return ;
        }
      }

      this.$emit('postSubmit', this.fields)
      return ;
      /*if (this.info.id) {
        this.model.$update({params: {action: 'update', query: {id: this.info.id}}, data: this.fields});
      } else {
        this.model.$create({params: {action: 'add'}, data: this.fields});
      }*/
    }
  }
};
</script>
<style lang="scss" src="../../assets/common/css/change.scss"></style>
