<template>
  <el-dropdown trigger="click" class="international" @command="handleChangeRole">
    <div>
	  <el-tag v-if="currentRoleDetail">{{currentRoleDetail.name}}</el-tag>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="currentRole===index" :command="index" v-for="(item, index) in roles" :key="index">
		{{item.name}} ( {{index}} )
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
	roles() {
	  return this.localCache.getCache('roleDetails');
	},
	currentRole() {
	  return this.localCache.getCache('currentRole');
	},
	currentRoleDetail() {
	  let rDetail = this.roles[this.currentRole] ? this.roles[this.currentRole] : {};
	  return rDetail;
	}
  },
  methods: {
    handleChangeRole(rCode) {
      if (rCode == this.currentRole) {
      	return ;
	  }
	  
      this.$store.dispatch('permission/changeRole', rCode)
        .then(() => {
          this.$router.go({path: '/'})
        });
    }
  }
}
</script>
