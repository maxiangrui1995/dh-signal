<template>
  <el-dropdown @command="handleCommand" class="layout-header-tools-btn-con">
    <span>{{userName}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="user">
        <i class="fa fa-user" style="margin-right: 5px;"></i>
        <span>个人中心</span>
      </el-dropdown-item>
      <el-dropdown-item divided command="logout">
        <i class="fa fa-sign-out" style="margin-right: 5px;"></i>
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    userName() {
      return this.$store.state.userName || "用户";
    }
  },
  methods: {
    handleCommand(command) {
      if (command === "user") {
        this.handleSetting();
      }
      if (command === "logout") {
        this.handleLogout();
      }
    },
    handleLogout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "注销中...";
            // ajax
            this.$http("index/d_user/logout").then(res => {
              if (res.status) {
                setTimeout(() => {
                  this.$router.replace({
                    name: "login"
                  });
                }, 600);
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
              done();
              instance.confirmButtonLoading = false;
            });
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
        }
      })
        .then(() => {})
        .catch(() => {});
    },
    handleSetting() {
      /* this.$router.replace({
        path: "/userSetting"
      }); */
    }
  }
};
</script>

