<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="popFormVisible" :destroy-on-close="destroyOnClose" width="90%" :append-to-body="appendToBody">
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
import {fetchData} from '@/applications/mixins/fetchData';
import elemForms from '@/components/ElemForm'

export default {
  'mixins': [fetchData],
  name: 'ListForm',
  data() {
    return {
      elemForms: elemForms,
      formFields: {},

      //radio: 3,
      //input: '',
      dialogStatus: '',
      popFormVisible: false,
      textMap: {
        create: 'Create'
      },
      destroyOnClose: false,
      loadSurvey: true,
      currentRow: {},
      inputInfos: {},
    }
  },
  computed: {
    rules() {
      return this.addFormFields;
    },
  },
  props:{                     
    appendToBody: {type: Boolean, default: false}
  },
  methods: {
    handlePopForm(params) {
      this.popFormVisible = true
      let row = params.row;
      let operation = params.operation;
      this.model = this.getModel(operation.app, operation.resource);
      //this.getList(row, operation);
      this.model.$create({params: {}, data: {point_scene: 'get_formelem'}}).then(response => {
        if (response === false) {
          return ;
        }
        this.formFields = response.formFields;
        this.fieldNames = response.fieldNames;
        for (let field in this.formFields) {
          let item = this.formFields[field];
          this.inputInfos[field] = item.defaultValue ? item.defaultValue : '';
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })

        return ;
      })
    },
    addData() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
            return ;
        }
        let data = this.model.formatAddDirtData(this.inputInfos, this.addFormFields, this.getModel('passport', 'attachmentInfo'));
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
