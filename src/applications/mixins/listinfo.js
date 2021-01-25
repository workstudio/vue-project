import {fetchData} from '@/applications/mixins/fetchData';
import elemLists from '@/components/ElemList'
import elemButtons from '@/components/ElemButton'

export const listinfo = {
  'mixins': [fetchData],
  data() {
    return {
      elemLists: elemLists,
      elemButtons: elemButtons,
      tableKey: 0,
      listLoading: true,
      dialogStatus: '',
      dialogPvVisible: false,

      addFormFields: {},
      updateFormFields: {},
      dialogFormVisible: false,
      list: [],
      fieldNames: {},
    }
  },
  methods: {
    handleAdd() {
      this.$refs.listForm.handleAdd();
    },
    handleUpdate(row) {
      let model = this.cModel;
      if (model.fetchDetail) {
        let keyField = model.keyField;
        model.$get({params: {keyField: row[keyField].valueSource}}).then(response => {
          if (response === false) {
            this.$notify({
              title: '错误',
              message: '信息有误',
              type: 'error',
              duration: 2000
            });
            return ;
          }
            console.log(response);
          this.$refs.listForm.handleUpdate(response.data);
        })
      } else {
        this.$refs.listForm.handleUpdate(row);
      }
    },
    dealAction(params) {
      let actionType = params.actionType;
  	  switch (actionType) {
      case 'update':
        this.handleUpdate(params.datas);
        return this.handleFilter();
        break;
      case 'delete':
        return this.handleFilter();
        break;
      }
    },
  }
}
