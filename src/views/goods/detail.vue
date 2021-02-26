<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品基本"></el-step>
      <el-step title="填写商品属性和SKU"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      :model="cModel"
      :updateFormFields="updateFormFields"
      :addFormFields="addFormFields"
      :fieldNames="fieldNames"
      :currentInfo="currentInfo"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>
    <product-attr-detail
      v-show="showStatus[1]"
      :model="cModel"
      :is-edit="isEdit"
      :currentInfo="currentInfo"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <!--<product-sale-detail
      v-show="showStatus[1]"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-relation-detail
      v-show="showStatus[3]"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail>-->
  </el-card>
</template>
<script>
import '@/styles/mall/index.scss'

import {fetchData} from '@/applications/mixins/fetchData';
import ProductInfoDetail from './components/ProductInfoDetail';
import ProductAttrDetail from './components/ProductAttrDetail';
//import ProductSaleDetail from './ProductSaleDetail';
//import ProductRelationDetail from './ProductRelationDetail';
//import {createProduct,getProduct,updateProduct} from '@/api/product';

export default {
  'mixins': [fetchData],
  name: 'ProductDetail',
  components: {ProductInfoDetail, ProductAttrDetail},//, ProductSaleDetail, ProductRelationDetail},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addFormFields: {},
      updateFormFields: {},
      fieldNames: {},
      action: this.$route.meta.action,

      active: 0,
      currentInfo: {},
      showStatus: [true, false],
    }
  },
  created() {
    if (this.action == 'add') {
      this.cModel.$create({params: {}, data: {point_scene: 'get_formelem'}}).then(response => {
        if (response === false) {
          return ;
        }
        this.addFormFields = response.formFields;
        this.fieldNames = response.fieldNames;
        return ;
      })
    } else if (this.action == 'edit') {
    }
  },
  methods: {
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false;
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    nextStep(info) {
      this.currentInfo = info;
      if (this.active < this.showStatus.length - 1) {
        this.active++;
        this.hideAll();
        this.showStatus[this.active] = true;
      }
    },
    finishCommit(isEdit) {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(isEdit){
          updateProduct(this.$route.query.id,this.inputInfos).then(response=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            this.$router.back();
          });
        }else{
          createProduct(this.inputInfos).then(response=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            location.reload();
          });
        }
      })
    }
  }
}
</script>
<style>
  .form-container {
    width: 900px;
  }
</style>
