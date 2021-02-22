<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="popFormVisible" :destroy-on-close="destroyOnClose" width	="90%">
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
        <el-button @click="popFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="addData()">
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
      popFormVisible: false,
      textMap: {
        create: 'Create'
      },
      formType: 'add',
      destroyOnClose: false,
      loadSurvey: true,
      currentRow: {},
      inputInfos: {},
    }
  },
  computed: {
    formFields() {
      return this.addFormFields;
    },
    rules() {
      return this.addFormFields;
    },
  },
  props:{                     
  },
  methods: {
    handlePopForm() {
      //this.resetTemp()
      this.formType = 'add'
      this.popFormVisible = true
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
          this.popFormVisible = false
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
  }
}
</script>
