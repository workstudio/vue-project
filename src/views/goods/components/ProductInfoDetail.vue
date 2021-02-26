<template>
  <div style="margin-top: 50px">
    <!--<el-form ref="dataForm" :rules="rules" :model="inputInfos" label-position="left" label-width="70px" style="width: 1200px; margin-left:30px;">-->
    <el-form :model="inputInfos" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <component
        v-for="(formField, field) in formFields"
        :key="field"
        :field="field"
        :elem="formField"
        :inputInfos.sync="inputInfos"
        :is="elemForms[formField.type]">
      </component>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import elemForms from '@/components/ElemForm'

export default {
  name: "ProductInfoDetail",
  props:{                     
    elem: {type: Object},
    model: {type: Function},  
    //info: {type: Object},     
    addFormFields: {type: Object},
    updateFormFields: {type: Object},
    fieldNames: {type: Object},
    currentInfo: {type: Object},
    title: {type: String, default: ''},
    //showBack: {type: String, default: ''},
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputInfos: {},
      elemForms: elemForms,
      hasEditCreated:false,
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
      rules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        subTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
        productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        brandId: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
        description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
        requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
      }
    };
  },
  created() {
    //this.getProductCateList();
    //this.getBrandList();
  },
  computed:{
    formFields() {
      if (this.formType == 'update') {
        return this.updateFormFields;
      }
      return this.addFormFields;
    },
    //商品的编号
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.value.productCategoryId = newValue[1];
        this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
      } else {
        this.value.productCategoryId = null;
        this.value.productCategoryName=null;
      }
    }
  },
  methods: {
    //处理编辑逻辑
    handleEditCreated(){
      if(this.value.productCategoryId!=null){
        this.selectProductCateValue.push(this.value.cateParentId);
        this.selectProductCateValue.push(this.value.productCategoryId);
      }
      this.hasEditCreated=true;
    },
    getCateNameById(id){
      let name=null;
      for(let i=0;i<this.productCateOptions.length;i++){
        for(let j=0;j<this.productCateOptions[i].children.length;j++){
          if(this.productCateOptions[i].children[j].value===id){
            name=this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    handleNext(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep', this.inputInfos);
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration:1000
          });
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
</style>
