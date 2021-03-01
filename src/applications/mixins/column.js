import {globalSettings} from '@/utils/base'

export const column = {
  name: "column",
  components: {
  },

  data() {
    return {}
  },
  props: {
    row: {type: Object, default() {}},
    fieldItem: {type: Object, default() {}},
    field: {type: String, default: ''},
    model: null,
  },
  methods: {
    handleRowChange() {
      if (this.currentValue == this.row[this.field].valueSource) {
        return ;
      }
      let keyField = this.model.keyField;
      //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      let data = {}
      data[this.field] = this.currentValue;
      this.model.$update({params: {keyField: this.row[keyField].valueSource, action: 'update'}, data: data}).then(response => {
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
      })
    },
  }
}
