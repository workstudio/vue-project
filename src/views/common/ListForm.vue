<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :destroy-on-close="destroyOnClose" width	="90%">
      <el-form ref="dataForm" :rules="rules" :model="inputInfos" label-position="left" label-width="70px" style="width: 1200px; margin-left:30px;">
        <component
          v-for="(formField, field) in formFields"
          v-if="loadSurvey"
          :key="field"
          :field="field"
          :elem="formField"
          :inputInfos.sync="inputInfos"
          :is="elemForms[formField.type]">
        </component>
        <!--<span v-for="(item, index) in formFields" :key="index">
            {{index}}-{{item.type}}-{{fieldNames[index]}}
        </span>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="formType==='update'?updateData():addData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elemForms from '@/components/ElemForm'

export default {
  name: 'ListForm',
  data() {
    return {
      elemForms: elemForms,

      //radio: 3,
      //input: '',
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      formType: 'add',
      destroyOnClose: false,
      loadSurvey: true,
      currentRow: {},
      inputInfos: {},
      /*rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },*/
      //inputExts: {},
      /*inputInfos: {
        id: undefined,
        importance: 1,
        controller: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },*/
    }
  },
  computed: {
    formFields() {
      if (this.formType == 'update') {
        return this.updateFormFields;
      }
      return this.addFormFields;
    },
    rules() {
      if (this.formType == 'update') {
        return this.updateFormFields;
      }
      return this.addFormFields;
    },
    /*inputInfos() {
      let data = {};
      for (let field in this.formFields) {
        let item = this.formFields[field];
        data[field] = item.defaultValue ? item.defaultValue : '';
      }
      return data;
    }*/
  },
  props:{                     
    elem: {type: Object},
    model: {type: Function},  
    //info: {type: Object},     
    addFormFields: {type: Object},
    updateFormFields: {type: Object},
    fieldNames: {type: Object},
    title: {type: String, default: ''},
    //showBack: {type: String, default: ''},
  },
  methods: {
    handleAdd() {
      //this.resetTemp()
      this.dialogStatus = 'add'
      this.formType = 'add'
      this.dialogFormVisible = true
      for (let field in this.formFields) {
        let item = this.formFields[field];
        this.inputInfos[field] = item.defaultValue ? item.defaultValue : '';
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
            return ;
        }
        let data = this.model.formatAddDirtData(this.inputInfos, this.addFormFields);
        this.model.$create({params: {}, data: data}).then(response => {
          if (response === false) {
            return ;
          }
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
      })
    },
    handleUpdate(row) {
      this.currentRow = row;
      //this.inputInfos.timestamp = new Date(this.inputInfos.timestamp)
      this.destroyOnClose = true;
      this.formType = 'update';
      //this.inputInfos = Object.assign({}, row) // copy obj
      let data = {};
      for (let field in row) {
        let item = row[field];
        this.inputInfos[field] = item.valueSource ? item.valueSource : '';
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.loadSurvey = false;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.loadSurvey = true;
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let keyField = this.model.keyField;
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          let data = this.model.formatDirtData(this.inputInfos, this.currentRow, this.updateFormFields);
          this.model.$update({params: {keyField: this.currentRow[keyField].valueSource, action: 'update'}, data: data}).then(response => {
            if (response === false) {
              return ;
            }
            //const index = this.list.findIndex(v => v.id === this.inputInfos.id)
            //this.list.splice(index, 1, this.inputInfos)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            return this.$emit('handleFilter');
          })
        }
      })
    },
  }
}
</script>
