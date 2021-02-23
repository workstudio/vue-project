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
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>
    <product-attr-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <!--<product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail>-->
  </el-card>
</template>
<script>
import '@/styles/mall/index.scss'

import {fetchData} from '@/applications/mixins/fetchData';
import ListForm from '@/views/common/ListForm'
import ProductInfoDetail from './components/ProductInfoDetail';
//import ProductSaleDetail from './ProductSaleDetail';
import ProductAttrDetail from './components/ProductAttrDetail';
//import ProductRelationDetail from './ProductRelationDetail';
//import {createProduct,getProduct,updateProduct} from '@/api/product';

const defaultProductParam = {
  albumPics: '',
  brandId: null,
  brandName: '',
  deleteStatus: 0,
  description: '',
  detailDesc: '',
  detailHtml: '',
  detailMobileHtml: '',
  detailTitle: '',
  feightTemplateId: 0,
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  giftPoint: 0,
  giftGrowth: 0,
  keywords: '',
  lowStock: 0,
  name: '',
  newStatus: 0,
  note: '',
  originalPrice: 0,
  pic: '',
  //会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  //商品满减
  productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
  //商品阶梯价格
  productLadderList: [{count: 0,discount: 0,price: 0}],
  previewStatus: 0,
  price: 0,
  productAttributeCategoryId: null,
  //商品属性相关{productAttributeId: 0, value: ''}
  productAttributeValueList: [],
  //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
  skuStockList: [],
  //商品相关专题{subjectId: 0}
  subjectProductRelationList: [],
  //商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaProductRelationList: [],
  productCategoryId: null,
  productCategoryName: '',
  productSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
};
export default {
  'mixins': [fetchData],
  name: 'ProductDetail',
  components: {ListForm, ProductInfoDetail, ProductAttrDetail},//, ProductSaleDetail, ProductRelationDetail},
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
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false, false]
    }
  },
  created() {
    if (this.action == 'add') {
      this.cModel.$create({params: {}, data: {point_scene: 'get_formelem'}}).then(response => {
        if (response === false) {
          return ;
        }
          console.log(response);
        this.addFormFields = response.formFields;
        this.fieldNames = response.fieldNames;
        //this.list.unshift(this.inputInfos)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
        return this.$emit('handleFilter');
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
    nextStep() {
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
          updateProduct(this.$route.query.id,this.productParam).then(response=>{
            this.$message({
              type: 'success',
              message: '提交成功',
              duration:1000
            });
            this.$router.back();
          });
        }else{
          createProduct(this.productParam).then(response=>{
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


