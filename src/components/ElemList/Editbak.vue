<template>
      <div>
<template>
          <template v-if="editStatus">
            <el-input v-model="row[field].valueSource" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-if="!editStatus">{{ row[field].value }}{{editStatus}}</span>
</template>

          <el-button
            v-if="editStatus"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editStatus=!editStatus"
          >
            Edit
          </el-button>
      </div>
</template>

<script>
export default {
  data() {
    return {
      editStatus: false,
    }
  },
  props: {
    row: {type: Object, default() {}},
    field: {type: String, default: ''},
  },
  methods: {
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })  
    },  
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })  
    }   
  }
}
</script>
