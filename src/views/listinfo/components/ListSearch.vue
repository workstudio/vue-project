<template>
  <div>
    <div class="filter-container">
      <component
        v-for="(searchField, field) in searchFields"
        :key="field"
        :field="field"
        :listQuery.sync="listQuery"
        :elem="searchField"
        @dealAction="dealAction"
        :is="elemSearchs[searchField.type]">
      </component>
      <component
        v-if="Object.keys(searchFields).lengthl!=0"
        key="search"
        @dealAction="dealAction"
        :is="elemButtons.search">
      </component>
      <component
        v-for="button in currentResource[4]"
        :key="button.action"
        :elem="button"
        :model="model"
        @dealAction="dealAction"
        :is="elemButtons[button.action]">
      </component>
    </div>
  </div>
</template>
<script>
import elemButtons from '@/components/ElemButton'
import elemSearchs from '@/components/ElemSearch'

export default {
  name: 'ListSearch',
  data() {
    return {
      elemSearchs: elemSearchs,
      elemButtons: elemButtons,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
    }
  },
  props:{                     
    model: {type: Function},  
    searchFields: {type: Object},
    listQuery: {type: Object},
    currentResource: {type: Object},
  },
  methods: {
    dealAction(params) {
      let actionType = params.actionType;
  	  switch (actionType) {
        case 'add':
        return this.$emit('handleAdd');
        break;
      case 'search':
        this.listQuery.page = 1
        return this.$emit('handleFilter');
        break;
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
  }
}
</script>
