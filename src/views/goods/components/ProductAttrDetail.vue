<template>
  <div style="margin-top: 50px">
    <el-form :model="inputInfos" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
        <div>{{test}}</div>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in attributeElems" :class="{littleMarginTop:index!==0}">
            <div class="paramInputLabel">{{item.name}}:</div>
            <el-select v-if="item.inputType===1" class="paramInput" v-model="attributeElems[index].value">
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="attributeElems[index].currentValue"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(skuElem,idx) in skuElems">
            {{skuElem.name}}：
            <el-checkbox-group v-if="skuElem.handAddStatus===0" v-model="skuElems[idx].values">
              <el-checkbox v-for="item in skuElem.values" :label="item.name" :key="item.value" class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="skuElems[idx].values">
                <div v-for="(item,index) in skuElem.values" style="display: inline-block" class="littleMarginLeft">
                  <el-checkbox :label="item.name" :key="item.value"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="skuInfos" border>
          <el-table-column
            v-for="(item,index) in skuElems"
            :label="item.name"
            :key="item.id"
            align="center">
            <template slot-scope="scope">
              {{scope.row['skuname' + index + '']}}
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="库存预警值"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="SKU编号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuPrice">同步价格
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuStock">同步库存
        </el-button>-->
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectProductAttrPics">
            <span>{{item.name}}:</span>
            <single-upload v-model="item.pic"
                           style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchData} from '@/applications/mixins/fetchData';
//import {fetchList as fetchProductAttrCateList} from '@/api/productAttrCate'
//import {fetchList as fetchProductAttrList} from '@/api/productAttr'
import SingleUpload from '@/components/Upload/SingleUpload'
import MultiUpload from '@/components/Upload/MultiUpload'
//import Tinymce from '@/components/Tinymce'

export default {
  name: "ProductAttrDetail",
  'mixins': [fetchData],
  components: {SingleUpload, MultiUpload},//, Tinymce},
  props: {
    model: {type: Function},  
    currentInfo: {type: Object},
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      attributeElems: {},
      skuElems: {},
      attributeInfos: {},
      inputInfos: {},
      skuInfos: [],

      hasEditCreated:false, //编辑模式时是否初始化成功
      productAttributeCategoryOptions: [], //商品属性分类下拉选项
      selectProductAttr: [], //选中的商品属性
      selectProductParam: [], //选中的商品参数
      selectProductAttrPics: [], //选中的商品属性图片
      addProductAttrValue: '', //可手动添加的商品属性
      activeHtmlName: 'pc' //商品富文本详情激活类型
    }
  },
  computed: {
    test() {
      console.log(this.currentInfo, 'iiiiiiiiii');
    },
    attributeModel(){
      return this.getModel('infocms', 'goodsAttribute');
    },
    skuModel(){
      return this.getModel('infocms', 'goodsSku');
    },
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    //商品的主图和画册图片
    selectProductPics:{
      get:function () {
        let pics=[];
        if(this.inputInfos.pic===undefined||this.inputInfos.pic==null||this.inputInfos.pic===''){
          return pics;
        }
        pics.push(this.inputInfos.pic);
        if(this.inputInfos.albumPics===undefined||this.inputInfos.albumPics==null||this.inputInfos.albumPics===''){
          return pics;
        }
        let albumPics = this.inputInfos.albumPics.split(',');
        for(let i=0;i<albumPics.length;i++){
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set:function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.inputInfos.pic = null;
          this.inputInfos.albumPics = null;
        } else {
          this.inputInfos.pic = newValue[0];
          this.inputInfos.albumPics = '';
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.inputInfos.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.inputInfos.albumPics += ',';
              }
            }
          }
        }
      }
    }
  },
  created() {
    this.getGoodsSkuAttributes();
  },
  watch: {
    productId:function (newValue) {
      if(!this.isEdit)return;
      if(this.hasEditCreated)return;
      if(newValue===undefined||newValue==null||newValue===0)return;
      this.handleEditCreated();
    },
    currentInfo: function (info) {
      if (info == null || info.category_code == this.currentCategoryCode) {
        return ;
      }
    }
  },
  methods: {
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      this.$emit('nextStep')
    },
    getGoodsSkus() {
      let params = {
        point_scene: 'goods',
        goods_id: 113,
      };
      this.fetchRequest(this.skuModel, {query: params}).then(response => {
        this.list = response.data;
        this.addFormFields = response.addFormFields;
        this.updateFormFields = response.updateFormFields;
        this.fieldNames = response.fieldNames;
        this.pageLinks = response.links,
        this.pageMeta = response.meta,
        this.searchFields = response.searchFields,

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getProductSkuSp(row, index) {
        console.log(row, 'wwwrrrrr', index);
        return row.skuname1;

      /*let spData = JSON.parse(row.spData);
      if(spData!=null&&index<spData.length){
        return spData[index].value;
      }else{
        return null;
      }*/
    },
    getGoodsSkuAttributes() {

      let keyField = this.model.keyField;
      //this.model.$update({params: {keyField: this.currentRow[keyField].valueSource, action: 'update'}, data: data}).then(response => {
      this.model.$get({params: {keyField: 113, action: 'get'}, query: {point_scene: 'full'}}).then(response => {
        console.log(response, 'rrrrrrrrrrrrr');
        this.attributeElems = response.data.attributeElems;
        this.skuElems = response.data.skuElems;
        this.skuInfos = response.data.skuInfos;
        /*this.list = response.data;
        this.addFormFields = response.addFormFields;
        this.updateFormFields = response.updateFormFields;
        this.fieldNames = response.fieldNames;
        this.pageLinks = response.links,
        this.pageMeta = response.meta,
        this.searchFields = response.searchFields,*/

        // Just to simulate the time of the request
      })

      /*let param = {pageNum: 1, pageSize: 100, type: type};
      fetchProductAttrList(cid, param).then(response => {
        let list = response.data.list;
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(i);
            }
            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options
            });
          }
          if(this.isEdit){
            //编辑模式下刷新商品属性图片
            this.refreshProductAttrPics();
          }
        } else {
          this.selectProductParam = [];
          for (let i = 0; i < list.length; i++) {
            let value=null;
            if(this.isEdit){
              //编辑模式下获取参数属性
              value= this.getEditParamValue(list[i].id);
            }
            this.selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList
            });
          }
        }
      });*/
    },

    /*handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if(this.inputInfos.productAttributeCategoryId!=null){
        this.handleProductAttrChange(this.inputInfos.productAttributeCategoryId);
      }
      this.hasEditCreated=true;
    },
    getProductAttrCateList() {
        return ;
      let param = {pageNum: 1, pageSize: 100};
      fetchProductAttrCateList(param).then(response => {
        this.productAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({label: list[i].name, value: list[i].id});
        }
      });
    },
    getProductAttrList(type, cid) {
      let param = {pageNum: 1, pageSize: 100, type: type};
      fetchProductAttrList(cid, param).then(response => {
        let list = response.data.list;
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(i);
            }
            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options
            });
          }
          if(this.isEdit){
            //编辑模式下刷新商品属性图片
            this.refreshProductAttrPics();
          }
        } else {
          this.selectProductParam = [];
          for (let i = 0; i < list.length; i++) {
            let value=null;
            if(this.isEdit){
              //编辑模式下获取参数属性
              value= this.getEditParamValue(list[i].id);
            }
            this.selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList
            });
          }
        }
      });
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = [];
      for (let i = 0; i < this.inputInfos.productAttributeValueList.length; i++) {
        let attrValue = this.inputInfos.productAttributeValueList[i];
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(',');
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
          break;
        }
      }
      return options;
    },
    //获取选中的属性值
    getEditAttrValues(index) {
      let values = new Set();
      if (index === 0) {
        for (let i = 0; i < this.inputInfos.skuStockList.length; i++) {
          let sku = this.inputInfos.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData!= null && spData.length>=1) {
            values.add(spData[0].value);
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < this.inputInfos.skuStockList.length; i++) {
          let sku = this.inputInfos.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData!= null && spData.length>=2) {
            values.add(spData[1].value);
          }
        }
      } else {
        for (let i = 0; i < this.inputInfos.skuStockList.length; i++) {
          let sku = this.inputInfos.skuStockList[i];
          let spData = JSON.parse(sku.spData);
          if (spData!= null && spData.length>=3) {
            values.add(spData[2].value);
          }
        }
      }
      return Array.from(values);
    },
    //获取属性的值
    getEditParamValue(id){
      for(let i=0;i<this.inputInfos.productAttributeValueList.length;i++){
        if(id===this.inputInfos.productAttributeValueList[i].productAttributeId){
          return this.inputInfos.productAttributeValueList[i].value;
        }
      }
    },
    handleProductAttrChange(value) {
      this.getProductAttrList(0, value);
      this.getProductAttrList(1, value);
    },
    getInputListArr(inputList) {
      return inputList.split(',');
    },
    handleAddProductAttrValue(idx) {
      let options = this.selectProductAttr[idx].options;
      if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
        this.$message({
          message: '属性值不能为空',
          type: 'warning',
          duration: 1000
        });
        return
      }
      if (options.indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: '属性值不能重复',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue);
      this.addProductAttrValue = null;
    },
    handleRemoveProductAttrValue(idx, index) {
      this.selectProductAttr[idx].options.splice(index, 1);
    },
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if(spData!=null&&index<spData.length){
        return spData[index].value;
      }else{
        return null;
      }
    },
    handleRefreshProductSkuList() {
      this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshProductAttrPics();
        this.refreshProductSkuList();
      });
    },
    handleSyncProductSkuPrice(){
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.inputInfos.skuStockList!==null&&this.inputInfos.skuStockList.length>0){
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(tempSkuList,this.inputInfos.skuStockList);
          let price=this.inputInfos.skuStockList[0].price;
          for(let i=0;i<tempSkuList.length;i++){
            tempSkuList[i].price=price;
          }
          this.inputInfos.skuStockList=[];
          this.inputInfos.skuStockList=this.inputInfos.skuStockList.concat(this.inputInfos.skuStockList,tempSkuList);
        }
      });
    },
    handleSyncProductSkuStock(){
      this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.inputInfos.skuStockList!==null&&this.inputInfos.skuStockList.length>0){
          let tempSkuList = [];
          tempSkuList = tempSkuList.concat(tempSkuList,this.inputInfos.skuStockList);
          let stock=this.inputInfos.skuStockList[0].stock;
          let lowStock=this.inputInfos.skuStockList[0].lowStock;
          for(let i=0;i<tempSkuList.length;i++){
            tempSkuList[i].stock=stock;
            tempSkuList[i].lowStock=lowStock;
          }
          this.inputInfos.skuStockList=[];
          this.inputInfos.skuStockList=this.inputInfos.skuStockList.concat(this.inputInfos.skuStockList,tempSkuList);
        }
      });
    },
    refreshProductSkuList() {
      this.inputInfos.skuStockList = [];
      let skuList = this.inputInfos.skuStockList;
      //只有一个属性时
      if (this.selectProductAttr.length === 1) {
        let attr = this.selectProductAttr[0];
        for (let i = 0; i < attr.values.length; i++) {
          skuList.push({
            spData: JSON.stringify([{key:attr.name,value:attr.values[i]}])
          });
        }
      } else if (this.selectProductAttr.length === 2) {
        let attr0 = this.selectProductAttr[0];
        let attr1 = this.selectProductAttr[1];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([{key:attr0.name,value:attr0.values[i]}])
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            let spData = [];
            spData.push({key:attr0.name,value:attr0.values[i]});
            spData.push({key:attr1.name,value:attr1.values[j]});
            skuList.push({
              spData: JSON.stringify(spData)
            });
          }
        }
      } else {
        let attr0 = this.selectProductAttr[0];
        let attr1 = this.selectProductAttr[1];
        let attr2 = this.selectProductAttr[2];
        for (let i = 0; i < attr0.values.length; i++) {
          if (attr1.values.length === 0) {
            skuList.push({
              spData: JSON.stringify([{key:attr0.name,value:attr0.values[i]}])
            });
            continue;
          }
          for (let j = 0; j < attr1.values.length; j++) {
            if (attr2.values.length === 0) {
              let spData = [];
              spData.push({key:attr0.name,value:attr0.values[i]});
              spData.push({key:attr1.name,value:attr1.values[j]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
              continue;
            }
            for (let k = 0; k < attr2.values.length; k++) {
              let spData = [];
              spData.push({key:attr0.name,value:attr0.values[i]});
              spData.push({key:attr1.name,value:attr1.values[j]});
              spData.push({key:attr2.name,value:attr2.values[k]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
            }
          }
        }
      }
    },
    refreshProductAttrPics() {
      this.selectProductAttrPics = [];
      if (this.selectProductAttr.length >= 1) {
        let values = this.selectProductAttr[0].values;
        for (let i = 0; i < values.length; i++) {
          let pic=null;
          if(this.isEdit){
            //编辑状态下获取图片
            pic=this.getProductSkuPic(values[i]);
          }
          this.selectProductAttrPics.push({name: values[i], pic: pic})
        }
      }
    },
    //获取商品相关属性的图片
    getProductSkuPic(name){
      for(let i=0;i<this.inputInfos.skuStockList.length;i++){
        let spData = JSON.parse(this.inputInfos.skuStockList[i].spData);
        if(name===spData[0].value){
          return this.inputInfos.skuStockList[i].pic;
        }
      }
      return null;
    },
    //合并商品属性
    mergeProductAttrValue() {
      this.inputInfos.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i];
        if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
          this.inputInfos.productAttributeValueList.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options)
          });
        }
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i];
        this.inputInfos.productAttributeValueList.push({
          productAttributeId: param.id,
          value: param.value
        });
      }
    },
    //合并商品属性图片
    mergeProductAttrPics() {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.inputInfos.skuStockList.length; j++) {
          let spData = JSON.parse(this.inputInfos.skuStockList[j].spData);
          if (spData[0].value === this.selectProductAttrPics[i].name) {
            this.inputInfos.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
          }
        }
      }
    },
    getOptionStr(arr) {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ',';
        }
      }
      return str;
    },
    handleRemoveProductSku(index, row) {
      let list = this.inputInfos.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    getParamInputList(inputList) {
      return inputList.split(',');
    },*/
  }
}
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px
}

.cardBg {
  background: #F8F9FC;
}
</style>
