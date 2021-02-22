<template>
  <div>
    <el-dialog :visible.sync="dialogAuthorityVisible" :title="roleName + '-角色的权限'" width="80%">
      <el-form label-width="100px" label-position="left">
        <el-form-item label="Menus">
          <el-tree ref="tree" node-key="code" :check-strictly="checkStrictly" :data="permissionTrees" :props="defaultProps" show-checkbox class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogAuthorityVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="updateAuthority">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'ListForm',
  data() {
    return {
      defaultProps: {
        children: 'subInfos',
        label: function(data, node) {
          return data.name + '  /  ' + data.app + '  /  ' + data.resource_code;
        }
      },
      roleName: '',
      roleCode: '',
      permissionTrees: [],

      checkStrictly: false,

      dialogAuthorityVisible: false,
      loadSurvey: true,
    }
  },
  computed: {
  },
  props:{                     
    elem: {type: Object},
    model: {type: Function},  
  },
  methods: {
    handleAuthority(datas) {
      this.dialogAuthorityVisible = true
      this.loadSurvey = false;
      this.roleCode = datas.code;
      this.roleName = datas.name;
      this.permissionTrees = datas.trees;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(datas.checked);
        this.loadSurvey = true;
      })
    },
    updateAuthority() {
      let data = {
        code: this.roleCode, 
        permissions: this.$refs.tree.getCheckedKeys(),
      };
      this.model.$create({params: {action: 'authority'}, data: data}).then(response => {
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
        this.dialogAuthorityVisible = false;
        return ;
        //return this.$emit('handleFilter');
      })
    },
  }
}
</script>
