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
      this.$refs.listForm.handleUpdate(row);
    },
    dealAction(params) {
      let actionType = params.actionType;
  	  switch (actionType) {
      case 'update':
        return this.handleUpdate(params.datas);
        break;
      case 'delete':
        return this.handleFilter();
        break;
      }
    },
  }
}
